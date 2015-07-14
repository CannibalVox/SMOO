import socketio = require('socket.io');
import http = require('http');
import mongoose = require('mongoose');
import comment = require('../../models/comment');

export class SmooNet {
    private smooServer: SocketIO.Server;

    constructor(server: http.Server) {
        this.smooServer = socketio(server);

        var self = this;
        this.smooServer.on('connection', function(socket:SocketIO.Socket) { self.onConnection(socket);});
    }

    onConnection(socket:SocketIO.Socket) {
        var self = this;
        socket.on('sendComment', function(comment:any) {
            self.sendComment(comment);
        });
        self.retrieveAndSend(function(err:any, data:comment.IComment[]) {
            if (!err)
                self.sendToSingle(socket, err, data);
            else
                console.log(err);
        });
    }

    sendComment(commentData:any) {
        var self = this;
        comment.repo.create(commentData, function(err) {
            if (!err) {
                self.retrieveAndSend(function(err:any, data:comment.IComment[]) {
                    if (!err) {
                        self.sendToAll(err,data);
                    } else {
                        console.log(err);
                    }
                });
            } else {
                console.log(err);
            }
        });
    }

    retrieveAndSend(callback: (err:any, data:comment.IComment[]) => void) {
        comment.repo.find({}, callback);
    }

    sendToSingle(socket:SocketIO.Socket, error:any, data:comment.IComment[]) {
        if (!error) {
            socket.emit('updateComments', data);
        } else {
            console.log(error);
        }
    }

    sendToAll(error:any, data:comment.IComment[]) {
        if (!error) {
            this.smooServer.emit('updateComments', data);
        } else {
            console.log(error);
        }
    }
}
