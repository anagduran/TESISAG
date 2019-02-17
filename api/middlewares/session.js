
import session from 'express-session'
import token from '../models/token'

const middlewares = {

    isLoggedIn : function (req, res, next) {

        
        token.find().exec().then(tk =>{
            if(tk.length>0)
            {
                return next();
            }
            else
                {
                console.log("en el else");
                res.redirect('login'); 
                }
                
      
        })
    } 
       
};
module.exports = middlewares;