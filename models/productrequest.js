import mongoose from "mongoose";

const productrequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: false }, // لا يوجد unique
  phone: { type: String, required: false }, // لا يوجد unique
  ProductTitle: { type: String, required: false },
  Productprice: { type: Number, required: false },
});

const productrequest = mongoose.model("productrequest", productrequestSchema);

export default productrequest;
