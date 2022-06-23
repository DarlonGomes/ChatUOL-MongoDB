import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { login , onlineUsers } from '../src/api/participants-config.js'

dotenv.config();

const server = express();
server.use(cors());
server.use(express.json());



server.post("/participants", (req, res) => login(req, res));
server.get("/participants", (req, res) => onlineUsers(req, res));

server.get("/", (req, res) =>{
    res.send(`Olá, estou funcionando na rota ${process.env.PORT}`)
})


server.listen(process.env.PORT, () => {console.log(`Tá rodando na rota ${process.env.PORT}`)})