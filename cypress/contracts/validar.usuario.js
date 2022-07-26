const Joi = require('joi')

const usuarioSchema = Joi.object({
    quantidade: Joi.number(),
    usuarios: Joi.array().items({
        email: Joi.string(),
        nome: Joi.string(),
        password: Joi.string(),
        "administrador": "true",
        "_id": Joi.string()
    })
})
export default usuarioSchema;