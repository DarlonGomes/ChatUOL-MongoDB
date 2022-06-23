
import dayjs from "dayjs";
import client from "../setup/database";

await client.connect();
let db = client.db('uol')

export const login = async (req, res) => {
    const user = req.body;
    
    const activeUsers= await db.collection('activerUsers').find().toArray();
    const userAlreadyExist = activeUsers.some(activeUser => activeUser.name === user.name)

    if(userAlreadyExist) return res.sendStatus(409);
}


