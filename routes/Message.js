import express from 'express';
import Group from '../models/Message.js';

const router = express.Router();

 
router.post('/create-group', async (req, res) => {
  const { name } = req.body;

  try {
    const newGroup = new Group({ name, messages: [] });
    await newGroup.save();
    res.status(201).json({ success: true, message: 'Group created successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create group' });
  }
});
 
router.post('/:group/send', async (req, res) => {
  const { group } = req.params;
  const { username, message } = req.body;

  try {
    const targetGroup = await Group.findOne({ name: group });
    if (!targetGroup) {
      return res.status(404).json({ success: false, error: 'Group not found' });
    }

    targetGroup.messages.push({ username, message });
    await targetGroup.save();
    res.status(201).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to send message' });
  }
});

 router.get('/:group', async (req, res) => {
  const { group } = req.params;

  try {
    const targetGroup = await Group.findOne({ name: group });
    if (!targetGroup) {
      return res.status(404).json({ success: false, error: 'Group not found' });
    }

    res.status(200).json(targetGroup.messages);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to retrieve messages' });
  }
});

 
router.get('/', async (req, res) => {
  try {
    const groups = await Group.find({});
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to retrieve groups' });
  }
});

export default router;
