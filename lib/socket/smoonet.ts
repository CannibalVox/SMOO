import socketio = require('socket.io');
import http = require('http');

var data = [
  {"author": "Pete Hunt", "text": "This is one comment"},
  {"author": "Jordan Walke", "text": "This is *another* comment"}
];

export class SmooNet {
    private smooServer: SocketIO.Server;

    constructor(server: http.Server) {
        this.smooServer = socketio(server);

        var self = this;
        this.smooServer.on('connection', function(socket:SocketIO.Socket) { self.onConnection(socket);});
    }

    onConnection(socket:SocketIO.Socket) {
        var self = this;
        socket.on('sendComment', function(comment:any) { self.sendComment(comment); });
        socket.emit('updateComments', data);
    }

    sendComment(comment:any) {
        data.push(comment);
        this.smooServer.emit('updateComments', data);
    }
}
