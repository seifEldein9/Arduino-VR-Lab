import express from 'express';
import Contact from '../models/Contact.js';

const router = express.Router();

router.post('/add-message', async (req, res) => {
  try {
    const { name, email, message } = req.body;

  
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'يجب ملء جميع الحقول المطلوبة.' });
    }

    const newMessage = new Contact({
      name,
      email,
      Message: message,
    });

    await newMessage.save();

    res.status(201).json({
      message: 'تم إرسال الرسالة بنجاح.',
      contact: newMessage,
    });
  } catch (error) {
    console.error('Error adding message:', error.message, error.stack);

   
    if (error.code === 11000 && error.keyPattern && error.keyPattern.Message) {
      return res.status(400).json({
        message: 'تم إرسال نفس الرسالة مسبقًا.',
      });
    }

    res.status(500).json({ message: 'حدث خطأ أثناء إرسال الرسالة.', error: error.message });
  }
});
router.get('/get-messages', async (req, res) => {
  try {
    const messages = await Contact.find();
    res.status(200).json({
      message: 'تم جلب الرسائل بنجاح.',
      contacts: messages,
    });
  } catch (error) {
    console.error('Error fetching messages:', error.message, error.stack);
    res.status(500).json({ message: 'حدث خطأ أثناء جلب الرسائل.', error: error.message });
  }
});
export default router;
