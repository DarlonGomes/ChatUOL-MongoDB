import joi from 'joi';

export const messageSchema = joi.object({
    to: joi.string().min(1).trim().required(),
    text: joi.string().min(1).trim().required(),
    type: joi.string().valid('private_message','message').trim().required(),
    from: joi.string().min(1).trim().required(),
    time: joi.string().min(1).trim().required()
})

export const userSchema = joi.object({
    name: joi.string().min(1).trim().required(),
    lastStatus: joi.number()
})