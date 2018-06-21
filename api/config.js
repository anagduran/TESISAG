//configuracion de express

import express from "express"
import logger from "morgan"
import bodyparser from "body-parser"
import {config} from "dotenv"


//const app = express();
const SETTINGS = config()

export default app => {
    app.disable('x-powered-by')

    app.set('env', SETTINGS.parsed.ENV)
    app.set('config',SETTINGS.parsed)
    app.locals.env=app.get('env')
    app.locals,config = app.get('config')

    if(process.env.NODE_ENV!== 'test'){
        app.use(logger('combined'))
    }

    app.use(bodyparser.urlencoded({extended: false}));
    app.use(bodyparser.json());

    
}




//cargando rutas
app.use('/category', categoryRouter)