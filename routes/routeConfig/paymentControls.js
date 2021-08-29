const Payment = require('../../db/models/payment');
const User = require('../../db/models/user');
const Product = require('../../db/models/product');

const paymentControls = {
     
    getPayments: async(req, res) =>{
        try {
            const payments = await Payment.find();
            res.json(payments);
        } 
        catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    createPayment: async(req, res) => {
        try {
            const user = await User.findById(req.user.id).select('name email')
            if(!user) return res.status(400).json({msg: "User does not exist."})

            //from client side after payment successfull
            const {cart, paymentID, address} = req.body;

            //taking data from the user entry
            const {_id, name, email} = user;

            //storing payments with same id as user
            const newPayment = new Payment({
                user_id: _id, name, email, cart, paymentID, address
            })

            //updates the sold-out according to payout
            cart.filter(item => {
                return sold(item._id, item.quantity, item.sold);
            })

            await newPayment.save();
            //console.log(newPayment);
            res.json({msg: "Payment Success!"});
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

const sold = async (id, quantity, oldsale) =>{
    await Product.findOneAndUpdate({_id: id}, {
        sold: quantity + oldsale
    })
};

module.exports = paymentControls;