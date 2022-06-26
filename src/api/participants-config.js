
import dayjs from "dayjs";
import client from "../setup/database.js";
import { userSchema } from "../settings/joi-validations.js";


export const login = async (req, res) => {

    const user = {...req.body, lastStatus: Date.now()};

    const validation = userSchema.validate(user, {abortEarly: true});
    if(validation.error){return res.sendStatus(422)}
   
    
    await client.connect();
    const db = client.db('uol');

    const alreadyActive= await db.collection('activeUsers').findOne({name: user.name});
    if(!alreadyActive){
        try {
            const statusMessage = {
                from: user.name,
                to: 'Todos',
                text: 'entra na sala...',
                type: 'status',
                time: dayjs().format('HH:mm:ss')
            }
    
            await db.collection('activeUsers').insertOne(user);
            await db.collection('messages').insertOne(statusMessage);
    
            return res.sendStatus(201);
        } catch (error) {
            return res.sendStatus(422);
        }
    }
   
    return res.sendStatus(409);
    
} 

export const onlineUsers = async (_,res) => {
    await client.connect();
    const db = client.db('uol');

    const participants = await db.collection('activeUsers').find().toArray();
    console.log(participants);

    res.send(participants).status(200);
}

export const checkStatus = async (req, res) => {
    const user = req.headers.user;

    await client.connect();
    const db = client.db('uol');

    const isUserActive = await db.collection('activeUsers').findOne({name: user});
    
    if(isUserActive){
        await db.collection('activerUsers').updateOne({ name: user}, {$set: { lastStatus: Date.now() }});
       return res.sendStatus(200);
    }

    return res.sendStatus(404);
}


const userTimeout = async () => {
    let messages = [];

    await client.connect();
    const db = client.db('uol');

    const timeout = await db.collection('activeUsers').find({lastStatus: {$lt : Date.now() - 100000}}).toArray();
    
    await db.collection('activeUsers').deleteMany({lastStatus: {$lt : Date.now() - 100000}});

    for(let i = 0; i < timeout.length; i++){
        messages.push({
            from: timeout[i].name,
            to: 'Todos',
            text: 'sai da sala...',
            type: 'status',
            time: dayjs().format('HH:mm:ss')
        })
    }

    if(messages.length > 0){
        await db.collection('messages').insertMany(messages)
    }
}

setInterval(userTimeout, 15000)