import express from "express";
import Product from "../models/Product.js";  
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});

const router = express.Router();

 
const storage = multer.memoryStorage(); 
const upload = multer({ 
  storage,
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.startsWith('image')) {
      return cb(new Error('Only images are allowed'));  
    }
    cb(null, true);
  }
});

router.post('/add', upload.single('image'), async (req, res) => {
  console.log('Request Body:', req.body);
  console.log('File:', req.file);

  const { title, price, ProductStatus } = req.body;
  let address = req.body.address || '';  
  let Description = req.body.Description || '';  
  let imageUrl = '';

  try {
     
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream((error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }).end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }

    
    const product = new Product({ title, price, ProductStatus, address, Description, image: imageUrl });
    await product.save();

    res.status(201).json({ message: "Product added successfully", product });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(400).json({ error: err.message });
  }
});


 
router.get("/all", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products", error: error.message });
  }
});

 
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving product", error: error.message });
  }
});

export default router;
