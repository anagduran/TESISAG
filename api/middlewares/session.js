
import session from 'express-session'

const middlewares = {

    isLoggedIn : function (req, res, next) {
        console.log(session.email);
        if (session.email) return next();
        res.redirect('/');
    }
};
module.exports = middlewares;