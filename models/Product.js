import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, unique: true },
  image: { type: String, unique: true },
  ProductStatus: { type: String, required: true },
  address: { type: String, required: false },
  Description: { type: String, required: false },
 });

const Product = mongoose.model('Product', ProductSchema);

export default Product;
