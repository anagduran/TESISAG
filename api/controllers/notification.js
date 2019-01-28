import mongoose from "mongoose"
import notification from "../models/notification"



function getNotifications(req,res,next){
    try{
        notification.find()
                .exec()
                .then(notificacion => { 
                   
                        if(notification) {                        
                            res.status(200).render('notification/newNotification')
                        }else{
                            res.status(404).json({message: 'no hay variables'})
                        }   
            
                }).catch(err => {
                    console.log(err);
                    res.status(500).json({error: err})
                })
        }catch(error){
            console.log(error)
        }
    

}

function newNotification(req,res,next) {
    
    const notificacion = new notification({
        _id: new mongoose.Types.ObjectId(),
       notification: [{
        type: req.body.type,
        subject: req.body.subject,
        message: req.body.message,
        date: req.body.date, 
       }, {
        type: req.body.type2,
        subject: req.body.subject2,
        message: req.body.message2,
        date: req.body.date2,
        
       }]
      
        
        });
       
        try{ 
            notificacion.save()
                    .then(nuevanotificacion => {
                        res.status(200).json({newNotificacion: nuevanotificacion})
                     })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({error: err})
                    }); 
        }  
        catch(error){
           console.log(error) 
        }
}

module.exports ={getNotifications, newNotification};