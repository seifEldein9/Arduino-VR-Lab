import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },  
  email: { type: String, required: true }, 
  Message: { type: String, unique: true },  
});

export default mongoose.model('Contact', ContactSchema);
