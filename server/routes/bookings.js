import express from 'express';
import { createClient } from '@supabase/supabase-js';
import validator from 'validator';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ROOM_PRICES = {
  'Surf Loft': 90,
  'Ocean Suite': 120,
  'Villa': 150
};

// Create Booking
router.post('/', async (req, res) => {
  try {
    const { name, email, room, days } = req.body;

    // Validation
    if (!name || !email || !room || !days) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!validator.isLength(name, { min: 2, max: 100 })) {
      return res.status(400).json({ error: 'Name must be 2-100 characters' });
    }

    if (!ROOM_PRICES[room]) {
      return res.status(400).json({ error: 'Invalid room type' });
    }

    if (!Number.isInteger(days) || days < 1 || days > 90) {
      return res.status(400).json({ error: 'Days must be between 1 and 90' });
    }

    const price = days * ROOM_PRICES[room];

    // Insert into Supabase
    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        name: validator.trim(validator.escape(name)),
        email: validator.normalizeEmail(email),
        room,
        days,
        price,
        status: 'pending',
        created_at: new Date()
      }])
      .select();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to create booking' });
    }

    res.json({
      success: true,
      booking: data[0],
      message: 'Booking created successfully'
    });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Bookings
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ data });
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get Single Booking
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Booking not found' });

    res.json({ data });
  } catch (err) {
    console.error('Error fetching booking:', err);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Update Booking
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, email, room, days } = req.body;
    const updates = {};

    if (name) updates.name = validator.trim(validator.escape(name));
    if (email) {
      if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid email' });
      }
      updates.email = validator.normalizeEmail(email);
    }
    if (room) {
      if (!ROOM_PRICES[room]) {
        return res.status(400).json({ error: 'Invalid room type' });
      }
      updates.room = room;
    }
    if (days) {
      if (!Number.isInteger(days) || days < 1 || days > 90) {
        return res.status(400).json({ error: 'Invalid days' });
      }
      updates.days = days;
    }

    if (updates.room || updates.days) {
      const currentRoom = updates.room || (await supabase.from('bookings').select('room').eq('id', req.params.id)).data[0].room;
      const currentDays = updates.days || (await supabase.from('bookings').select('days').eq('id', req.params.id)).data[0].days;
      updates.price = currentDays * ROOM_PRICES[currentRoom];
    }

    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', req.params.id)
      .select();

    if (error) throw error;

    res.json({ success: true, booking: data[0] });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

export default router;
