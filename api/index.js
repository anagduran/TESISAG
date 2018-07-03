import mongoose from 'mongoose'
import config from './config'
import express from 'express'
import routes from './routes'
import {thisTypeAnnotation} from 'babel-types'
import bodyparser from 'body-parser'

//const host = 'mongodb://127.0.0.1/TRIVIA'



/*const conn = mongoose.createConnection(
    host,
    {poolSize: 200}
)

conn.on('error', err=>{
    console.log('Error',err)
    return ProcessingInstruction.exit()
})


conn.on('connected', ()=> console.log('conectado a mongo')) */

mongoose.connect('mongodb://127.0.0.1/TRIVIA')

mongoose.Promise= global.Promise



let _server 
const server ={
    start(){
        const app = express()

        config(app)
        routes(app)

        _server = app.listen(app.locals.config.PORT, ()=>{
            const address = _server.address()
            const host = address.address==='::'
            ? 'localhost'
            :address

            const port = app.locals.config.PORT
            if(process.env.NODE_ENV!='test'){
                console.log(`Server opened lsiten on http://${host}:${port}`)
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
