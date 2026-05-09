import express from 'express';
import { OpenAI } from 'openai';
import rateLimit from 'express-rate-limit';
import validator from 'validator';

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Too many chat messages. Please wait a moment.'
});

router.post('/message', chatLimiter, async (req, res) => {
  try {
    let { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Invalid message' });
    }

    // Sanitize input
    message = validator.trim(message).substring(0, 500);

    if (message.length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant for OCEVIA Surf House in Morocco. Help with booking inquiries, room information, and local surfing tips. Be friendly and professional.'
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const reply = response.choices[0].message.content;

    res.json({
      success: true,
      reply: validator.escape(reply),
      timestamp: new Date()
    });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

export default router;
