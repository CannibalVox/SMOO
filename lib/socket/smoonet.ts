import socketio = require('socket.io');
import http = require('http');

export class SmooNet {
    private smooServer: SocketIO.Server;

    constructor(server: http.Server) {
        this.smooServer = socketio(server);

        var self = this;
        this.smooServer.on('connection', function(socket:SocketIO.Socket) { self.onConnection(socket);});
    }

    onConnection(socket:SocketIO.Socket) {
        var self = this;
        socket.on('terminalIn', function(text:string) {
            self.sendTerminalOut(socket, text);
        });
    }

    sendTerminalOut(socket:SocketIO.Socket, text:string) {
        socket.emit('terminalOut', {out:text});
    }
}
