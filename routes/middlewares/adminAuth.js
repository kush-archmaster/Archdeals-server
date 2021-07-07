const User = require('../../db/models/user');

const adminAuth = async (req, res, next) =>{
    try {
        // Get user information by id
        const user = await User.findOne({
            _id: req.user.id
        });
        if(user.role === 0)
            return res.status(400).json({msg: "Admin access denied"});

        next();
        
    } catch (err) {
        return res.status(500).json({msg: err.message});
    }
}

module.exports = adminAuth;