import dayjs from "dayjs";
import client from "../setup/database.js";
import { messageSchema } from "../settings/joi-validations.js";

export const sendMessage = async (req,res) => {

    await client.connect();
    const db = client.db('uol');

    const isUserActive = await db.collection('activeUsers').findOne({name: req.headers.user});

    if(isUserActive){
        const message = {...req.body, from: req.headers.user, time: dayjs().format('HH:MM:SS') };

        const validation = messageSchema.validate(message, {abortEarly: true});
        if(validation.error){return res.sendStatus(422)}
        try {
            await db.collection('messages').insertOne(message);
            return res.sendStatus(201);
        } catch (error) {
            return res.send(error).status(500);
        }
    }

    return res.sendStatus(403);
}

export const getMessage = async (req,res) => {
    const user = req.headers.user;
    const limit = parseInt(req.query.limit);
    await client.connect();
    const db = client.db('uol');
    const isUserActive = await db.collection('activeUsers').findOne({name: user});
    
    if(isUserActive){
        try {
            const messages = await db.collection('messages').find({$or: [{to: user}, {to: "Todos"}]}).toArray();
            return res.send(messages.slice(-limit)).status(200);
        } catch (error) {
            return res.send(error).status(500);
        }
    }
    
    return res.sendStatus(403);
}