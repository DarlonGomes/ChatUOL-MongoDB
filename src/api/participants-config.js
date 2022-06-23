
import dayjs from "dayjs";
import client from "../setup/database.js";



export const login = async (req, res) => {

    const user = {...req.body, lastStatus: Date.now()};

    if(user.name === ""){
        return res.sendStatus(422)
    }
   
    
    await client.connect();
    const db = client.db('uol')

    const alreadyActive= await db.collection('activeUsers').findOne({name: user.name});

    if(alreadyActive !== null){
        return res.sendStatus(409);
    }
    
    try {
        const statusMessage = {
            from: user.name,
            to: 'Todos',
            text: 'entra na sala...',
            type: 'status',
            time: dayjs().format('HH:MM:SS')
        }

        await db.collection('activeUsers').insertOne(user);
        await db.collection('message').insertOne(statusMessage);

        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(422);
    }
}



