import mongoose from "mongoose"
import user from "../models/user"


function newUser(req,res,next) {
    
    const usuario = new user({
        _id: new mongoose.Types.ObjectId(),
        nickname: req.body.nickname,
        country_code: req.body.country_code,
        phone: req.body.phone,
        shared_code: req.body.shared_code,
        referral_code: req.body.referral_code,
        extra_life: req.body.extra_life,
        balance: req.body.balance
        
        });
       
        try{ 
            usuario.save()
                    .then(nuevouser => {
                        res.status(200).render('user/userDetail',{usuarioN: nuevouser})
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

function getUsers(req,res,next){
    try{
        user.find()
                .exec()
                .then(users => { 
                   
                        if(users) {                        
                            res.status(200).render('user/userAll',{usuarios: users})
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

function getUserID(req,res,next){
    const id = req.params.userID;
   
    if(mongoose.Types.ObjectId.isValid(id)){
        user.findById(id)
                .exec()
                .then(userByID =>{                
                    if(userByID){ 
                        res.status(200).json({usuario: userByID})
                        
                    }
                    else { 
                        res.status(404).json({message: 'no encontrado, ID incorrecto'})
                    }                
                })
                .catch(err=>{
                    console.log(err);
                    res.status(500).json({message:"aqui en el error 500"})
                })
    }
    else{
        res.status(404).json({message: "no valid entry for provided ID"})
    }
}

function updateUserByID(req, res, next){

    //const id = mongoose.Types.ObjectId(req.body._id)
    const id = req.params.userID;

    if (mongoose.Types.ObjectId.isValid(id)) {
        user.where({'_id': id})
                .update( {$set: {nickname: req.body.nickname, country_code: req.body.country_code, phone: req.body.phone, shared_code: req.body.shared_code,  referral_code: req.body.referral_code,extra_life: req.body.extra_life, balance: req.body.balance, }})
                .exec()
                .then(result =>{                    
                    if(result.nModified===1){
                    res.status(200).json({usuario: req.body})                      
                    }
                    else {                        
                        res.status(404).json({message: 'no encontrado'})
                    }
                })
                .catch(err =>{
                    res.status(500).json({error: err})
                })
    }
    else{
        res.status(404).json({message: 'error de id, incorrecto'})
    }
}

function deleteUserByID(req, res, next){
    
    const id = req.params.userID;    
    console.log(id)
    
    if(mongoose.Types.ObjectId.isValid(id)){
        user.findByIdAndRemove(id).exec().then(result=>{
            if(result){
                res.status(200).json({message: "eliminado con exito"})      
            }
            else {
                res.status(404).json({message: "ERROR ID"})
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({error: err})
        })
    }
    else{
        res.status(404).json({message: "error ID incorrecto"}) 
    }
}


function createUser(req,res, next){
    res.render('user/newUser')
}
module.exports ={createUser, newUser,  getUsers, getUserID, updateUserByID, deleteUserByID};