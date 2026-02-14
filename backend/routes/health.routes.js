const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.status(200).json({
      status: 'OK',
      timestamp: result.rows[0].now,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
