/**
 * Copyright (c) The Minerva Authors. See the accompanying LICENSE.txt.
 *
 * Copyright (c) 2008-2009, Maries Ionel Cristian
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 *
 * Implementation notes:
 *
 * Keep in mind that Flash plugin often runs outside of the main browser
 * process nowadays (IE8, Chrome, Firefox 3.7+, recent Safari).  This means
 * that the state could change completely on either the JavaScript side or
 * the Flash side.
 *
 * ExternalInterface is intended as a blocking call, so the side which makes
 * the call is suspended until a value is returned from the other side.
 *
 * We use random strings to identify {@link FlashConnection}s.  A FlashSocket
 * (JS side) or FlashConnection (Flash side) can disappear without the other
 * side first being made aware of it.  If we were very careful in our use of
 * ExternalInterface and callQueue, we could make them not disappear from
 * each other.  But this is more complicated and relies on more-correct
 * browser behavior.
 */

// Note: this module uses Flash-side ExternalInterface pseudo-namespace "__FC_".

package cw.net;

import flash.events.Event;
import flash.events.IOErrorEvent;
import flash.events.SecurityErrorEvent;
import flash.events.ProgressEvent;
import flash.external.ExternalInterface;
import flash.net.Socket;
import flash.system.Security;

// TODO: reject frames over a certain size, to prevent accidental DoS

// TODO: make sure Flash doesn't disconnect when there's a big unread
// frame. If it disconnects, we'll have to do our own buffering.

// TODO: unit test everything, especially handle_data

// TODO: should we ever detach listeners?


class FlashConnection {
	public var callbackFunc:String;
	public var socket:Socket;
	public var expecting:Int;
	public var prelude:String;
	public var preludeSent:Bool;
	public var id:String;
	public var ignoreEvents:Bool;
	//public var flashConnector:FlashConnector;

	public function new(myId, prelude, callbackFunc) {
		this.expecting = -1;
		this.preludeSent = false;
		this.ignoreEvents = false;
		this.id = myId;
		this.prelude = prelude;
		this.callbackFunc = callbackFunc;
		//flashConnector = fc;

		// "It is strongly advised to use the constructor form without
		// parameters, then add any event listeners, then call the
		// connect method with host and port parameters."
		this.socket = new Socket();
	}

	public inline function connect(host, port):String {
		// Flash 10 only; see http://kb2.adobe.com/cps/405/kb405545.html
		//socket.timeout = timeout;
		attachListeners();

		// "If the socket is already connected, the existing connection is closed first."
		// http://www.adobe.com/livedocs/flex/3/langref/flash/net/Socket.html#connect()
		socket.connect(host, port);

		return "OK";
	}

	public function close():String {
		// Adobe documents the event firing order possibilities very poorly.
		// We can't make any assumptions about how CLOSE/IO_ERROR/SECURITY_ERROR
		// will fire.  Thus, when we get one of those events, we ignore all
		// further events.
		ignoreEvents = true;
		if(socket.connected) {
			// Note: Flash Player (probably) doesn't dispatch a CLOSE after
			// .close() (though we would have ignored the CLOSE anyway).
			// "The close event is dispatched only when the server closes the
			// connection; it is not dispatched when you call the close() method."
			// https://www.adobe.com/livedocs/flex/2/langref/flash/net/Socket.html#close%28%29
			socket.close();
		}
		FlashConnector.done(id);

		return "OK";
	}

	public inline function handle_connect(event) {
		ignoreEvents = false;
		ExternalInterface.call(callbackFunc, id, "connect");
	}

	public inline function handle_close(event) {
		if(ignoreEvents) {
			return;
		}
		this.close();
		ExternalInterface.call(callbackFunc, id, "close");
	}

	public inline function handle_io_error(event) {
		if(ignoreEvents) {
			return;
		}
		this.close();
		// We assume that our Flash cw.json encoder is not necessary for event.text
		ExternalInterface.call(callbackFunc, id, "ioerror", event.text);
	}

	public inline function handle_security_error(event) {
		if(ignoreEvents) {
			return;
		}
		this.close();
		// We assume that our Flash cw.json encoder is not necessary for event.text
		ExternalInterface.call(callbackFunc, id, "securityerror", event.text);
	}

	public inline function handle_data(event) {
		if(ignoreEvents) {
			return;
		}
		var outBuffer = "["; // TODO: confirm lack of O(N^2) behavior
		var available:Int = socket.bytesAvailable;
		var comma:String = "";
		var hadError:Bool = false;

		while(true) {
			if(expecting == -1) { // Read the length prefix
				if(available < 4) {
					break;
				}
				available -= 4;
				try {
					// but remember that expecting is an Int,
					// not a UInt, of course.
					expecting = socket.readUnsignedInt();
				} catch (e:Dynamic) { // Unknown if IOError is ever actually thrown here
					hadError = true;
					break;
				}
			} else { // Read the payload
				if(available < expecting) {
					break;
				}
				available -= expecting;
				// We expect ASCII only, but use readUTFBytes anyway,
				// because that is probably the best-tested function.
				try {
					outBuffer += comma;
					// Wrap string in single quotes and backslash single
					// quotes, because the payload is less likely to contain them.
					// We expect that payload is JSON most of the time,
					// which is more likely to have double quotes.
					outBuffer += "'";
					// haXe has no .replace. We might want to call AS3/Flash 9's
					// native String.replace(/regex/g, ...) in the future.
					outBuffer += socket.readUTFBytes(
						expecting).split("\\").join("\\\\").split("'").join("\\'");
					outBuffer += "'";
					comma = ",";
				} catch (e:Dynamic) { // Unknown if IOError is ever actually thrown here
					hadError = true;
					break;
				}
				expecting = -1;
			}
		}

		outBuffer += "]";

		if(outBuffer != "[]") {
			ExternalInterface.call(
				callbackFunc + "('" + id + "', 'frames', " +
				outBuffer + "," + (hadError ? "true" : "false") + ")");
		} else {
			ExternalInterface.call(
				callbackFunc + "('" + id + "', 'stillreceiving', " +
				(hadError ? "true" : "false") + ")");
		}
	}

	public function writeFrames(msgs:Array<String>):String {
		if (!socket.connected) {
			// The JavaScript side should never see this (as long as it
			// has waited for onconnect), because if socket has
			// disconnected, then this FlashConnection shouldn't
			// exist either.  JavaScript side would see "no such instance"
			// instead.
			return "socket not connected";
		}

		if(!preludeSent) {
			preludeSent = true;
			try {
				socket.writeUTFBytes(this.prelude);
			} catch (e:Dynamic) { // IOErrorEvent.IO_ERROR
				this.close();
				ExternalInterface.call(callbackFunc, id, "ioerror",
					"FlashConnector error while writing prelude");
				return "OK";
			}
		}

		for(i in 0...msgs.length) {
			var msg:String = msgs[i];

			try {
				socket.writeUnsignedInt(msg.length);

				// Note: msg is not expected to be a unicode string!
				// (Well, it is, but it only has US-ASCII codepoints.)
				// We use writeUTFBytes because it is least-likely
				// to be buggy in Flash Player.  Back on 2008-10-08
				// (see /home/z9/.git), we had problems with
				// writeMultiByte(..., "iso-8859-1"); on some clients.
				socket.writeUTFBytes(msg);
			} catch (e:Dynamic) { // IOErrorEvent.IO_ERROR
				this.close();
				ExternalInterface.call(callbackFunc, id, "ioerror",
					"FlashConnector error while writing message frame #" + i);
				return "OK";
			}
		}

		try {
			socket.flush();
		} catch (e:Dynamic) { // IOErrorEvent.IO_ERROR
			this.close();
			ExternalInterface.call(callbackFunc, id, "ioerror",
				"FlashConnector error while flushing socket");
			return "OK";
		}

		return "OK";
	}

	public inline function attachListeners() {
		socket.addEventListener(Event.CONNECT, handle_connect);
		socket.addEventListener(Event.CLOSE, handle_close);
		socket.addEventListener(IOErrorEvent.IO_ERROR, handle_io_error);
		socket.addEventListener(SecurityErrorEvent.SECURITY_ERROR, handle_security_error);
		socket.addEventListener(ProgressEvent.SOCKET_DATA, handle_data);
	}
}


/**
 * Consider FlashConnector as the "external interface" that is exposed to JavaScript.
 * 
 * Because the JavaScript code cannot hold references to FlashConnection
 * objects, we look up the FlashConnection object every time based on the
 * `instance_id`.
 */
class FlashConnector {
	public static var connections:Hash<FlashConnection> = new Hash();
	public static var callbackFunc:String;

	public static inline function connect(instance_id:String, host:String, port:Int, prelude:String):String {
		// This implementation allows FlashConnection's Socket object to be reused,
		// but reusing is not recommended.
		var conn:FlashConnection = connections.get(instance_id);
		if (conn == null) {
			conn = new FlashConnection(instance_id, prelude, callbackFunc);
			connections.set(instance_id, conn);
		}

		conn.prelude = prelude;
		return conn.connect(host, port);
	}

	/**
	 * Close a socket. Returns "OK" if close succeeded.
	 */
	public static inline function close(instance_id:String):String {
		var conn = connections.get(instance_id);
		if(conn == null) {
			return "no such instance";
		}
		return conn.close();
	}

	public static inline function done(instance_id:String) {
		// `remove(...)` returns `true` if it was removed,
		// but we ignore the return value.
		connections.remove(instance_id);
	}

	// TODO: find out what happens if JS->Flash ExternalInterface call
	// is made with the wrong type of arguments

	/**
	 * Write an already-serialized frame `msg` to a socket.
	 * Returns "OK" if write succeeded.
	 */
	public static inline function writeFrames(instance_id:String, msgs:Array<String>):String {
		var conn = connections.get(instance_id);
		if(conn == null) {
			return "no such instance";
		}
		return conn.writeFrames(msgs);
	}

	public static inline function loadPolicyFile(path:String):Void {
		Security.loadPolicyFile(path);
	}

	/**
	 * Set callbackFunc. You must do this before calling other EI-exposed
	 * functions. Returns "OK" if setting callbackFunc succeeded.
	 */
	public static inline function setCallbackFunc(f:String):String {
		callbackFunc = f;
		return "OK";
	}

	public static inline function registerCallbacks() {
		//ExternalInterface.addCallback("__FC_loadPolicyFile", loadPolicyFile);
		ExternalInterface.addCallback("__FC_setCallbackFunc", setCallbackFunc);
		ExternalInterface.addCallback("__FC_connect", connect);
		ExternalInterface.addCallback("__FC_close", close);
		ExternalInterface.addCallback("__FC_writeFrames", writeFrames);
	}

	public static function main() {
		registerCallbacks();

		if (flash.Lib.current.loaderInfo.parameters.onloadcallback != null) {
			ExternalInterface.call(flash.Lib.current.loaderInfo.parameters.onloadcallback);
		}
	}
}
