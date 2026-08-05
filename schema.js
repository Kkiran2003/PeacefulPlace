const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    list : Joi.object({
        title: Joi.string().trim().required(),
        description : Joi.string().trim().required(),
        price : Joi.number().required().min(0),
        location :  Joi.string().required(),
        country : Joi.string().required(),
        image : Joi.object(
            
            {url : Joi.string().optional().allow("",null)})
 })
})