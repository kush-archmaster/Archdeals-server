const Product = require('../../db/models/product');

//Filtering , sorting and pagination of products
class Features {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    sorting(){

    };

    filtering(){
        //will store all the params passed 
        const queryObj = {...this.queryString} //queryString = req.query
        //console.log(queryObj); before filtering

        const excludeFields = ['page', 'sort', 'limit']  //deletes all params if insde queryObj
        excludeFields.forEach(el => delete(queryObj[el]));
       // console.log(queryObj); //after filtering

       let queryStr = JSON.stringify(queryObj);
   //    when query given as price[gt]=230 use square brkts
       queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match);
       //console.log({queryObj,queryStr});  //Json string

       //parsing it back in object
       this.query.find(JSON.parse(queryStr));

       console.log({queryStr})

        return this;
    };

    paginate(){

    };
}



const productControl = {
    getProducts: async(req, res) =>{
        try {
            //queryString = req.query (passed as param)
            const features = new Features(Product.find(), req.query)  //req.query
            .filtering() //this will filter according to our requirement
              
            const products = await features.query; //query == Product.find()

            res.json(products);

        } catch (err) {
            return res.status(500).json({msg: err.message});
        }
    },

    createProduct: async(req, res) =>{
        try {
            const {product_id, title, price, description, content, images, category} = req.body;
            if(!images) return res.status(400).json({msg: "No image upload"});

            const product = await Products.findOne({product_id});
            if(product)
                return res.status(400).json({msg: "This product already exists."});

            const newProduct = new Products({
                product_id, title: title.toLowerCase(), price, description, content, images, category
            });

            await newProduct.save();
            res.status(200).json({msg: "Created a product"});

        } catch (err) {
            return res.status(500).json({msg: err.message});
        }
    },

    deleteProduct: async(req, res) =>{
        try {
            await Products.findByIdAndDelete(req.params.id)
            res.json({msg: "Deleted a Product"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    updateProduct: async(req, res) =>{
        try {
            const {title, price, description, content, images, category} = req.body;
            if(!images) return res.status(400).json({msg: "No image upload"})

            await Products.findOneAndUpdate({_id: req.params.id}, {
                title: title.toLowerCase(), price, description, content, images, category
            })

            res.json({msg: "Updated a Product"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = productControl;