
import admin from '../models/admin'
import passport from 'passport'
import session from 'express-session'


function getLogin(req, res) {
        res.render('login/login'); 
}

function doingLogin(req, res) {
       
        admin.findOne({'email': req.body.email, 'password': req.body.password}).exec().then(result =>{

                if(result) {
                        session.email = req.body.email;
                        session.password = req.body.password;
                        console.log("en el if de login");
                        res.status(200).render("index");
                }
                else {
                        console.log("en el else");
                        res.status(404).render("login/login");  
                }
        })
  
}


module.exports ={getLogin, doingLogin};
