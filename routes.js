const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

router.post('/submit-message', async (req, res) => {
  const { message, mood } = req.body;

  try {
    const newMessage = new Message({
      message,
      mood
    });

    await newMessage.save();
    res.status(201).json({ success: true, message: "Message saved!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Something went wrong." });
  }
});

module.exports = router;
