import mongoose = require('mongoose');

export var schema = new mongoose.Schema({
    author:String,
    text:String
});

export interface IComment extends mongoose.Document {
    author: string,
    text: string
}

export var repo = mongoose.model<IComment>("Comment", schema);
