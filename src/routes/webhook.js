// const express = require('express');
// const router = express.Router();
// const { handleIncoming } = require('../controllers/whatsappController');

// router.post('/', handleIncoming);

// module.exports = router;
import express from 'express';
import { handleIncoming } from '../controllers/whatsappController.js'; // tu controlador

const router = express.Router();

// Ruta para Twilio (POST)
router.post('/', handleIncoming);

// Mantén el GET solo para pruebas si quieres
router.get('/', async (req, res) => {
  res.send('Webhook activo');
});

export default router;

