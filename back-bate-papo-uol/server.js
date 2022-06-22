import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import { MongoClient } from 'mongodb';

const server = express();
server.use(cors());
server.use(express.json());

const PORT = process.env.PORTA;


server.get("/", (req, res) => {
    res.send(`Olá, estou funcionando na rota ${PORT}`)
})





server.listen(PORT, () => {console.log(`Tá rodando na rota ${PORT}`)})