FileLike.prototype = new FlashSocket();
FileLike.prototype.constructor = FileLike;

function FileLike() {
    FlashSocket.apply(this, arguments)
    this.on_data = this.on_recv;
    this.buff = "";
    this.lines = [];
    this.maxbuff = this.maxbuff || 8192;
};
    
FileLike.prototype.on_recv = function(data) {
    if (data.indexOf("\n") != -1) {
        this.lines.push.apply(this.lines, (this.buff+data).split("\n"))
        for (var i=0; i<this.lines.length; i++) {
            this.on_line(this.lines[i]);
        }
        this.lines = []
        this.buff = '';
    } else {
        if (this.buf.length + data.length > this.maxbuff) {
            throw "Buffer Overflow";
        } else {
            this.buff += data;
        }
    }
}
mu = new FileLike({
    on_line: function(data) {
        console.log('line: '+data);
        document.getElementById('datapanel').value += data + '\n\n';
    },
    on_io_error: function(msg) {
        alert("IO ERROR: "+msg);
    },
    on_security_error: function(msg) {
        alert("SECURITY ERROR: "+msg);
    },
    on_close: function(msg) {
        alert("Connection closed.");
    },
    on_connect: function() {
        alert('Connected!');
        mu.write("GET / HTTP/1.0\r\n\r\n");
    }
});
//~ mu.connect('example.com', 80);
mu.connect('localhost', 1200);
console.log(mu);