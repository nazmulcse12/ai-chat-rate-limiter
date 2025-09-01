const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { authenticateToken } = require('./middleware/auth');
const chatRoutes = require('./routes/chat');
const authRoutes = require('./routes/auth');
const statusRoutes = require('./routes/status');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/chat', authenticateToken, chatRoutes);
app.use('/api/login', authRoutes);
app.use('/api/status', authenticateToken, statusRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});