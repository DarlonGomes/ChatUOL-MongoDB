
import dayjs from "dayjs";
import { Db } from "mongodb";



export const login = async (req, res) => {
    const user = req.body;
    
    const activeUsers= await db.collection('activerUsers').find().toArray();
    const userAlreadyExist = activeUsers.some(activeUser => activeUser.name === user.name)

    if(userAlreadyExist) return res.sendStatus(409);
}


