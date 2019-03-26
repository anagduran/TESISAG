import WebSocket from 'ws'

let instance 

export const connect = (variable) => {
    const socket = new WebSocket.Server({port: 4500})

    socket.on('connection', ws=> {
        instance = ws
        ws.send('Conectado al socket '+ variable)
        ws.onmessage = function(e) {
            console.log(e.data);
        }
    })


}


export const send = (method, url, data) => {
    if(instance) {
        instance.send(`${method} ${url} ${JSON.stringify(data)}`)
    }
}