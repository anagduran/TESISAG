
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
                        res.status(404).render("/");  
                }
        })
  
}

function logOut(req, res){
       
        token.remove().exec().then(result=>{
                if(result)
                {
                  console.log("en el if de logout");
                  res.status(200).render('login/login');
                        
                }
                else {
                        console.log("en el else");
                res.status(200).render("index", {error: "error al tratar de cerrar sesion, intente nuevamente"});
                }
        });
        
}

function forgotPW(req,res,next){
        res.status(200).render('forgot')
}

module.exports ={getLogin, doingLogin, logOut, forgotPW};
