let mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema(
    {
        _collectionId: { type: String, required: true },
        name: { type: String, required: true  },
        soldOut: { type: Boolean, required: true  },
        price: { type: Number, required: true  },
        description: { type: String, required: true  },
        images: { type: Array },
        ingredients: { type: Array },
        reviews: { type: Array }
    },
    {
        versionKey: false
    }
);

let Product = mongoose.model('Product', ProductSchema, 'Products');

module.exports = Product;
