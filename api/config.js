//configuracion de express

import logger from 'morgan'
import bodyparser from 'body-parser'
import {config} from "dotenv"
import cors from 'cors'
import methodOverride from 'method-override'
import expressValidator from 'express-validator'



const SETTINGS = config()

export default app => {
    app.disable('x-powered-by')

    app.set('env', SETTINGS.parsed.ENV)
    app.set('config',SETTINGS.parsed)
    app.locals.env=app.get('env')
    app.locals.config = app.get('config')

    if(process.env.NODE_ENV!== 'test'){
        app.use(logger('combined'))
    }
    
   
    app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({extended: false}));
    
    app.use(methodOverride("_method"));
    app.use(expressValidator());
    
    
    
    app.use(cors())
    
}
