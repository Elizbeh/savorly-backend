import Joi from 'joi';

//Middleware to validate user registration input
export const validateRegister = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')).required(),
        first_name: Joi.string().min(2).max(50).required(),
        last_name: Joi.string().min(2).max(50).required(),
        role: Joi.string().valid('admin', 'user').optional(),  // Allow role to be 'admin' or 'user', or leave it out
    });

    const { error } = schema.validate(req.body);
    console.log("Request body:", req.body);
    
    if (error) {
        console.log("Validation Error:", error.details[0].message);
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}


//Middleware to validate user Login input
export const validateLogin = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    console.log("Request body:", req.body);
    if (error) {
      console.log("Validation Error:", error.details);
      return res.status(400).json({ message: error.details[0].message });
    }    
    next();
};