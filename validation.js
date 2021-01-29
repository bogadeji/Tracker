const Joi = require('joi');

const signupValidation = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().min(6).max(255).required(),
        lastName: Joi.string().min(6).max(255).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).max(1024).required()
    });
   
    return schema.validate(data) 
};


const signinValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required(),
        password: Joi.string().required()
    });
   
    return schema.validate(data) 
}

module.exports = {
    signupValidation,
    signinValidation
}


