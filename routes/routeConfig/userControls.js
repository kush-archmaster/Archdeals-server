const User = require('../../db/models/user');
const Payment = require('../../db/models/payment');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userControl = {
    register: async (req, res) =>{
        try {
            const {name, email, password} = req.body;

            const user = await User.findOne({email})
            if(user) return res.status(400).json({msg: "The email already exists."})

            if(password.length < 6) 
                return res.status(400).json({msg: "Password must be at least 6 characters long."})

            // Password Encryption
            const passwordHash = await bcrypt.hash(password, 10)
            const newUser = new User({
                name, email, password: passwordHash
            })

            // Save in mongodb
            await newUser.save()

            // Then create jsonwebtoken to authentication and store in cookie
            const accesstoken = createAccessToken({id: newUser._id})
            const refreshtoken = createRefreshToken({id: newUser._id})

            res.cookie('jwt_token', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7*24*60*60*1000 
            })

            res.json({success:'Registered'})

        } catch (err) {
            return res.status(500).json({error: err.message})
        }
    } ,
    
    refreshToken: (req, res) =>{  //for generating token while registeration
        try {
            const token = req.cookies.jwt_token;
            if(!token) return res.status(400).json({msg: "Please Login or Register"})

            jwt.verify(token, process.env.REFRESH_TOKEN, (err, user) =>{
                if(err) return res.status(400).json({msg: "Please Login or Register"})

                const accesstoken = createAccessToken({id: user.id})

                res.json({accesstoken});
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
        
    } ,

    login: async (req, res) =>{
        try {
            const {email, password} = req.body;

            const user = await User.findOne({email})
            
            if(!user) return res.status(400).json({msg: "User does not exist."})

            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return res.status(400).json({msg: "Invalid Credentials"})

            // If login success , create access token and refresh token
            const accesstoken = createAccessToken({id: user._id})
            const refreshtoken = createRefreshToken({id: user._id})

            res.cookie('jwt_token', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7*24*60*60*1000 // 7d
            })

            res.json({success: 'Logged In'})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    logout: async (req, res) =>{
        try {
            res.clearCookie('jwt_token', {path: '/user/refresh_token'})
            return res.json({msg: "Logged out"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    getUser: async (req, res) =>{
        try {  //req.user.id is vallue passed by middleware
            const user = await User.findById(req.user.id).select('-password')  //gives data removing password from it
            if(!user) return res.status(400).json({msg: "User does not exist."})

            res.json(user);
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    addCart: async (req, res) =>{
        try {
            const user = await User.findById(req.user.id)
            if(!user) return res.status(400).json({msg: "User does not exist."})

            await User.findOneAndUpdate({_id: req.user.id}, {
                cart: req.body.cart
            });

            return res.json({msg: "Added to cart"});
        } 
        catch (err) {
            return res.status(500).json({msg: err.message});
        }
    },

    history: async (req, res) =>{
        try {
            const history = await Payment.find({user_id: req.user.id}) //coming from auth middleware
            res.json(history) //this is sent as response
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }

}


//functions for generating tokens
const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN, {expiresIn: '1d'})
}

const createRefreshToken = (user) =>{
    return jwt.sign(user, process.env.REFRESH_TOKEN, {expiresIn: '7d'})
}



module.exports = userControl;