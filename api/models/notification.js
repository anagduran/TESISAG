import mongoose from 'mongoose'

const notificationSchema =  mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    notification : [{
        type: {type: String},
        subject: {type: String},
        message: { type: String},
        date: {type: String}
    }]
   
},{ 
    versionKey: false
});

const notification = mongoose.model('notification', notificationSchema, 'notification')


module.exports = notification;