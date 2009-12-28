/*
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

Copyright (c) 2009-2010 Minerva team, All rights reserved.
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

class SocketBridge {
	public static var sockets:Hash<Socket> = new Hash();

	public static function handle_connect(id:String, event) {
		ExternalInterface.call("(function(id){ var inst = __FS_instances[id]; if (inst.on_connect) inst.on_connect();})", id);
	}

	public static function handle_close(id:String, event) {
		sockets.remove(id);
		ExternalInterface.call("(function(id){ var inst = __FS_instances[id]; if (inst.on_close) inst.on_close();})", id);
	}

	public static function handle_io_error(id:String, event) {
		ExternalInterface.call("(function(id, err){ var inst = __FS_instances[id]; if (inst.on_io_error) inst.on_io_error(err);})", id, event.text);
	}

	public static function handle_security_error(id:String, event) {
		ExternalInterface.call("(function(id, err){ var inst = __FS_instances[id]; if (inst.on_security_error) inst.on_security_error(err);})", id, event.text);
	}

	public static function handle_data(id:String, event) {
		var socket:Socket = sockets.get(id);
		if (socket != null) {
			var msg = socket.readUTFBytes(socket.bytesAvailable);
			ExternalInterface.call("(function(id, data){ var inst = __FS_instances[id]; if (inst.on_data) inst.on_data(data);})", id, msg);
		}
	}

	public static function connect(instance_id:String, host:String, port:Int) {
		var socket:Socket = sockets.get(instance_id);
		if (socket != null) {
			socket.connect(host, port);
		} else {
			socket = new Socket(host, port);
			sockets.set(instance_id, socket);

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
	}

	public static function close(instance_id:String) {
		var socket = sockets.get(instance_id);
		if (socket != null) {
			if (socket.connected) {
				socket.close();
				sockets.remove(instance_id);
			}
		}
	}

	public static function write(instance_id:String, msg) {
		var socket = sockets.get(instance_id);
		if (socket != null) {
			if (socket.connected) {
				socket.writeUTFBytes(msg);
				socket.flush();
			}
		}
	}

	public static function loadPolicyFile(path:String):Void {
		Security.loadPolicyFile(path);
	}

	public static function registerCallbacks() {
		// TODO: maybe obfuscate these names

		//ExternalInterface.addCallback("__FC_loadPolicyFile", loadPolicyFile);

		ExternalInterface.addCallback("__FC_connect", connect);
		ExternalInterface.addCallback("__FC_close", close);
		ExternalInterface.addCallback("__FC_write", write);
	}

	public static function main() {
		registerCallbacks();

		if (flash.Lib.current.loaderInfo.parameters.onloadcallback != null) {
			ExternalInterface.call(flash.Lib.current.loaderInfo.parameters.onloadcallback);
		}
	}
}
