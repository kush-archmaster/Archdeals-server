const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) =>{
    try {
        const token = req.header("Authorization") //token will be stored in this header
        if(!token) return res.status(400).json({msg: "Invalid Authentication"});

        await jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) =>{
            if(err) return res.status(400).json({msg: "Invalid Authentication"
        });
            
            req.user = user;
            next();
        })
    } catch (err) {
        return res.status(500).json({msg: err.message});
    }
}

module.exports = authenticate;