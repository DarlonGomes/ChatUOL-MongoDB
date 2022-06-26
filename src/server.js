import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { login , onlineUsers , checkStatus} from '../src/api/participants-config.js'
import { sendMessage, getMessage, deleteMessage, editMessage } from '../src/api/messages-config.js'

dotenv.config();

const server = express();
server.use(cors());
server.use(express.json());



server.post("/participants", (req, res) => login(req, res));
server.get("/participants", (req, res) => onlineUsers(req, res));
server.post("/messages", (req,res) => sendMessage(req,res));
server.get("/messages", (req, res) => getMessage(req, res));
server.post("/status", (req,res) => checkStatus(req, res));
server.delete("/messages/:id", (req, res) => deleteMessage(req, res));
server.put("messages/:id", (req, res) => editMessage(req, res));



server.listen(process.env.PORT, () => {console.log(`Tá rodando na rota ${process.env.PORT}`)})