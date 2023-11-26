//node http server
import * as http from 'node:http'

//express
import express, { Router } from 'express'
//middleware
import cors from 'cors'

//express routes
import user from './routes/user.js'
import follow from './routes/follow.js'

import { PrismaClient } from '@prisma/client'
//websocket for chat
import WebSocket,{ WebSocketServer } from 'ws'

const app = express()

const prisma = new PrismaClient()

app.use((req,res,next)=>{
    req.prisma = prisma
    next()
})

//middleware
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors())

//routes
app.use(user)
app.use(follow)

const server = http.createServer(app)

//chat WebSocket
const wss = new WebSocketServer({server})

wss.on('connection', (ws,req)=>{
    console.log('clients: '+ wss.clients.size)
    ws.on('message',(message)=>{
        console.log(message.toString())
        wss.clients.forEach((client)=>{
            if(client.readyState === WebSocket.OPEN){
                client.send(message.toString())
            }
        })
    })
})


server.listen(3000, ()=>{
    console.log('Example app listening on port ' + 3000)
})