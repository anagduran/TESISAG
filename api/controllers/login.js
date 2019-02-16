
import admin from '../models/admin'
import passport from 'passport'
import session from 'express-session'
import randomToken from 'random-token'
import token from '../models/token'
import mongoose from "mongoose"


function getLogin(req, res) {
        res.status(200).render('login/login'); 
}

function doingLogin(req, res) {
       
        admin.findOne({'email': req.body.email, 'password': req.body.password}).exec().then(result =>{

                if(result) {
                        var tokenSession = randomToken(16);
                        //var tokenSessionCript = token.generateHash(tokenSession);
                        //console.log(tokenSessionCript);
                        
                        const TOKEN = new token({
                         _id: new mongoose.Types.ObjectId(),
                         token: tokenSession,
                        })
                        TOKEN.save().then(newToken=>{
                                console.log(newToken);
                        }).catch(err=>{
                                console.log(err);
                        });
                        session.token = tokenSession;   
                        console.log("en el if");              
                        res.status(200).render("index");
                }
                else {
                        console.log("en el else"); 
                        res.status(404).render("home");  
                }
        })
  
}

function logOut(req, res){
        console.log("en el logout");
        token.remove().exec();
        res.status(200).render("/");
}


module.exports ={getLogin, doingLogin, logOut};
