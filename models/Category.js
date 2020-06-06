let mongoose = require('mongoose');
const CategorySchema = new mongoose.Schema(
    {
      is_collection: { type: Boolean, required: true },
      name: { type: String, required: true },
      available: { type: Boolean, required: true },
      featured_image: { type: String, required: true },
      description: { type: String, required: true },
      ending: { type: String, required: true },
      color: { type: String, required: true }
    },
    {
        versionKey: false
    }
);

let Category = mongoose.model('Category', CategorySchema, 'Categories');

module.exports = Category;
