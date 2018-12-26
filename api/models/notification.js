import mongoose from 'mongoose'

const notificationSchema =  mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    subject: {type: String},
    message: {type: String},
    creationDate: {type: Date},
    dateShipping:  {type: Date}, 
    game: {type: mongoose.Schema.Types.ObjectId, ref: 'game'}
},{ 
    versionKey: false
});

const notification =mongoose.model('notification', notificationSchema, 'notification')


module.exports = notification;