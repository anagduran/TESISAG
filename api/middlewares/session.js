
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
                res.redirect('/'); 
                }
                
      
        })
    } 
       
};
module.exports = middlewares;