import socketio = require('socket.io');
import http = require('http');

export class SmooNet {
    private smooServer: SocketIO.Server;

    constructor(server: http.Server) {
        this.smooServer = socketio(server);

        this.smooServer.on('connection', this.onConnection);
    }

    onConnection(socket:SocketIO.Socket):void {
            socket.emit('news', {hello: "world"});
            socket.on('my other event', this.otherEvent);
    }

    otherEvent(data:any) {
        console.log(data);
    }
}
