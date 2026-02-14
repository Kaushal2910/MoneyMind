const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('DB Test OK:', res.rows);
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error('DB Test Failed:', err);
  }
};

startServer();
