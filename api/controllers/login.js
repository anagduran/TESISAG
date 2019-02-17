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
        var token = randomToken(40);
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
                          'http://' + req.headers.host + '/reset/'+ token + '\n\n' +
                          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                      };

                      smtpTransport.sendMail(mailOptions, function(err) {
                        if (err) {
                                console.log('There was a problem')                              
                                res.status(404).render("login/forgot", {error: "There was a problem, try again"})
                            }
                            //Yay!! Email sent
                            else {
                                console.log('Email sent!')
                                res.status(200).render("login/forgot", {message: "An e-mail has been sent to " +req.body.email + " with further instructions."})
                            }
                      });
                 

                }else {
                        
                  res.status(404).render("login/forgot", {error: "este email no esta en la bd intente nuevamente"})
                }
        })
}
function ResetPW(req, res, next) {
      
        
        
        var pw1 = req.body.pw;
        var pw2 = req.body.pw2;     
     
    if(pw1 != pw2) {
            res.render('login/reset', {error: "Confirm Password dont match with Password"});
            return;
    }
    else {    
        admin.update({$set: {password: req.body.pw}}).exec().then( result=>{
           
                if(result.nModified===1){
                        admin.findOne().exec().then(result2=>{                       
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
                                        to: result2.email,                        
                                        subject: 'Node.js Password Reset',
                                        text: 'Hello,\n\n' +
                                        'This is a confirmation that the password for your account '+result.email +' has just been changed.\n'
                                };
                
                                smtpTransport.sendMail(mailOptions, function(err) {
                                        if (err) {
                                                console.log('There was a problem')
                                                console.log(err);   
                                                res.status(404).render('login/login', {error: "There was a problem, try again"})       
                                        }
                                        //Yay!! Email sent
                                        else {
                                                console.log('Email sent!')
                                                res.status(200).render('login/login', {message: "Success! Your password has been changed."})  
                                        }
                                })
                        })
                                      
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
