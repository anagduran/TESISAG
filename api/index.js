import mongoose from 'mongoose'
import config from './config'
import express from 'express'
import routes from './routes'
import {thisTypeAnnotation} from 'babel-types'
import bodyparser from 'body-parser'
import path from 'path'

//CONEXION A MONGODB
mongoose.connect('mongodb://127.0.0.1/TRIVIA')
mongoose.Promise= global.Promise

//SERVIDOR
let _server 
const server ={
    start(){
        const app = express()

        config(app)
        routes(app)
        
        app.set('views',path.join(__dirname,'/views'))
        app.set('view engine', 'jade');
        app.use(express.static(path.join(__dirname ,'/public/')))
        
        

        _server = app.listen(app.locals.config.PORT, ()=>{
            const address = _server.address()
            const host = address.address==='::'
            ? 'localhost'
            :address

            const port = app.locals.config.PORT
            if(process.env.NODE_ENV!=='test'){
                
                console.log(`Server opened listen on http://${host}:${port}`)
                
            }
        })
    },
   close(){
       _server.close()
   }
}

export default server



if(!module.parent){
    server.start()
}
