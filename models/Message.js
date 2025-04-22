import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  username: { type: String, required: true },   
  message: { type: String, required: true },   
  timestamp: { type: Date, default: Date.now }  
});

const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },  
  messages: [MessageSchema], 
});

export default mongoose.model('Group', GroupSchema);
