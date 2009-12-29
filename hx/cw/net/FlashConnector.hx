/*
Copyright (c) 2009-2010, Minerva team. All rights reserved.

Copyright (c) 2008-2009, Maries Ionel Cristian

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

// Note: this module uses Flash-side ExternalInterface pseudo-namespace "__FC_" 

package cw.net;

import flash.events.Event;
import flash.events.IOErrorEvent;
import flash.events.SecurityErrorEvent;
import flash.events.ProgressEvent;
import flash.external.ExternalInterface;
import flash.net.Socket;
import flash.system.Security;

// TODO: the design could be better by having a separate object for each
// connection, rather than passing the instance_id around. With this better
// design, we wouldn't have this crazy global `expectingLength' map.

// TODO: reject frames over a certain size, to prevent accidental DoS


class FlashConnector {
	public static var sockets:Hash<Socket> = new Hash();

	// Map of socket # as String -> length of frame the socket is expecting (or -1 if not known)
	public static var expectingLength:Hash<Int> = new Hash();

	// Map of socket # as String -> first frame sent?
	public static var firstFrameSent:Hash<Bool> = new Hash();

	public static inline function handle_connect(id:String, event) {
		ExternalInterface.call("(function(id){ var inst = __FS_instances[id]; if (inst.onconnect) inst.onconnect();})", id);
	}

	public static inline function handle_close(id:String, event) {
		sockets.remove(id);
		expectingLength.remove(id);
		firstFrameSent.remove(id);
		ExternalInterface.call("(function(id){ var inst = __FS_instances[id]; if (inst.onclose) inst.onclose();})", id);
	}

	public static inline function handle_io_error(id:String, event) {
		ExternalInterface.call("(function(id, err){ var inst = __FS_instances[id]; if (inst.onioerror) inst.onioerror(err);})", id, event.text);
	}

	public static inline function handle_security_error(id:String, event) {
		ExternalInterface.call("(function(id, err){ var inst = __FS_instances[id]; if (inst.onsecurityerror) inst.onsecurityerror(err);})", id, event.text);
	}

	public static inline function handle_data(id:String, event) {
		var socket:Socket = sockets.get(id);
		if (socket != null) {
			var outBuffer = "["; // TODO: confirm lack of O(N^2) behavior
			var expecting:Int = expectingLength.get(id);
			var available:UInt = socket.bytesAvailable;
			var comma:String = "";
			var hadError:Bool = false;

			while(true) {
				if(expecting == -1) { // Read the length prefix
					if(available < 4) {
						break;
					}
					available -= 4;
					try {
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
					// Expecting ASCII only, but using readUTFBytes anyway.
					try {
						outBuffer += comma;
						outBuffer += socket.readUTFBytes(expecting);
						comma = ",";
					} catch (e:Dynamic) { // Unknown if IOError is ever actually thrown here
						hadError = true;
						break;
					}
					expecting = -1;
				}
			}

			expectingLength.set(id, expecting);

			outBuffer += "]";

			if(outBuffer != "[]") {
				// We expect an ASCII-safe string of JSON, so doing this is okay.
				ExternalInterface.call("__FS_instances['"+id+"'].onframes("+outBuffer+","+(hadError ? "true" : "false")+")");
			}
		}
	}

	public static inline function connect(instance_id:String, host:String, port:Int) {
		// ugh: "If the socket is already connected, the existing connection is closed first."
		// http://www.adobe.com/livedocs/flex/3/langref/flash/net/Socket.html#connect()
		// This implementation allows the socket to be reused.
		var socket:Socket = sockets.get(instance_id);
		if (socket == null) {
			// "It is strongly advised to use the constructor form without parameters,
			// then add any event listeners, then call the connect method with host  and port parameters."
			socket = new Socket();
			sockets.set(instance_id, socket);
			expectingLength.set(instance_id, -1);
			firstFrameSent.set(instance_id, false);

			socket.addEventListener( Event.CONNECT,
				function(e):Void { handle_connect(instance_id, e); }
			);

			socket.addEventListener( Event.CLOSE,
				function(e):Void { handle_close(instance_id, e); }
			);

			socket.addEventListener( IOErrorEvent.IO_ERROR,
				function(e):Void { handle_io_error(instance_id, e); }
			);

			socket.addEventListener( SecurityErrorEvent.SECURITY_ERROR,
				function(e):Void { handle_security_error(instance_id, e); }
			);

			socket.addEventListener( ProgressEvent.SOCKET_DATA,
				function(e):Void { handle_data(instance_id, e); }
			);
		}

 		// Flash 10 only; see http://kb2.adobe.com/cps/405/kb405545.html
		//socket.timeout = timeout;
		socket.connect(host, port);
	}

	/**
	 * Close a socket. Returns `true` if close succeeded.
	 */
	public static inline function close(instance_id:String) {
		var socket = sockets.get(instance_id);
		if (socket == null || !socket.connected) {
			return false;
		}

		socket.close();
		sockets.remove(instance_id);
		expectingLength.remove(instance_id);
		firstFrameSent.remove(instance_id);

		return true;
	}

	// TODO: find out what happens if JS->Flash ExternalInterface call is made with the wrong type of arguments

	/**
	 * Write an already-serialized frame `msg` to a socket. Returns `true` if write succeeded.
	 */
	public static inline function writeSerializedFrames(instance_id:String, msgs:Array<String>) {
		var socket = sockets.get(instance_id);
		if (socket == null || !socket.connected) {
			return false;
		}

		var writePrelude = firstFrameSent.get(instance_id) == false;

		if(writePrelude) {
			firstFrameSent.set(instance_id, true);
			try {
				socket.writeUTFBytes("<int32/>\n");
			} catch (e : Dynamic) { // IOErrorEvent.IO_ERROR
				// TODO: send a log message to javascript, or something
				return false;
			}
		}

		for(i in 0...msgs.length) {
			var msg:String = msgs[i];

			try {
				socket.writeUnsignedInt(msg.length);

				// Note: msg is not expected to be a unicode string! (Well, it is, but it only has US-ASCII codepoints.)
				// We use writeUTFBytes because it is least-likely to be buggy in Flash Player. Back in 2008-10-08
				// (see /home/z9/.git), we had problems with writeMultiByte(..., "iso-8859-1"); on some clients.
				socket.writeUTFBytes(msg);
			} catch (e : Dynamic) { // IOErrorEvent.IO_ERROR
				// TODO: send a log message to javascript, or something
				return false;
			}
		}

		try {
			socket.flush();
		} catch (e : Dynamic) { // IOErrorEvent.IO_ERROR
			// TODO: send a log message to javascript, or something
			return false;
		}

		return true;
	}

	public static inline function loadPolicyFile(path:String):Void {
		Security.loadPolicyFile(path);
	}

	public static inline function registerCallbacks() {
		// TODO: maybe obfuscate these names

		//ExternalInterface.addCallback("__FC_loadPolicyFile", loadPolicyFile);

		ExternalInterface.addCallback("__FC_connect", connect);
		ExternalInterface.addCallback("__FC_close", close);
		ExternalInterface.addCallback("__FC_writeSerializedFrames", writeSerializedFrames);
	}

	public static function main() {
		registerCallbacks();

		if (flash.Lib.current.loaderInfo.parameters.onloadcallback != null) {
			ExternalInterface.call(flash.Lib.current.loaderInfo.parameters.onloadcallback);
		}
	}
}
