import admin from '../models/admin'
import passport from 'passport'
import session from 'express-session'
import randomToken from 'random-token'
import token from '../models/token'
import mongoose from "mongoose"
import nodemailer from 'nodemailer'


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
                        res.status(404).render("login/login");  
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
        res.status(200).render('login/forgot')
}

function doingResetPW(req, res, next) {
        admin.findOne({'email': req.body.email}).exec().then(result=>{
                if(result){
                  console.log("holi");
                  var smtpTransport = nodemailer.createTransport( {
                        host: "smtp.gmail.com",
                        port: 465,
                        tls: true,
                        auth: {
                          user: 'anaduranwork@gmail.com',
                          pass: '21415776ag-'
                        }
                      });

                      var mailOptions = {
                        from: 'anaduranwork@gmail.com',
                        to: result.email,                        
                        subject: 'Node.js Password Reset',
                        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                          'http://' + req.headers.host + '/reset'+ '\n\n' +
                          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                      };

                      smtpTransport.sendMail(mailOptions, function(err) {
                        if (err) {
                                console.log('There was a problem')
                                console.log(err);

                            }
                            //Yay!! Email sent
                            else {
                                console.log('Email sent!')
                            }
                      });
                 

                }else {
                        console.log(req.headers.host);
                  res.status(404).render("login/forgot", {error: "este email no esta en la bd intente nuevamente"})
                }
        })
}
function ResetPW(req, res, next) {
        req.check("pw").notEmpty().withMessage("Los campos de opciones no pueden estar vacios")
        req.check("pw2").notEmpty().withMessage("Los campos de opciones no pueden estar vacios")
       
        var errors = req.validationErrors();
     
    if(errors){
            console.log(errors);
            res.render('login/reset', {error: errors});
            return;
    }
    else {    
        admin.update({$set: {password: req.body.pw}}).exec().then( result=>{
                console.log(result.nModified);
                if(result.nModified===1){
                        
                 console.log("en el if");
                 res.status(200).render('login/login', {message: "cambio de clave exitoso"})                        
                }
                else { 
                           
                 res.status(404).render( 'login/reset', { error: "Error de servidor, intente nuevamente"} )
                                                     
                       
                }

        })
    }

}

function getResetPW(req, res, next) {
 res.status(200).render("login/reset");
}
module.exports ={getLogin, doingLogin, logOut, forgotPW, doingResetPW, ResetPW,  getResetPW};
