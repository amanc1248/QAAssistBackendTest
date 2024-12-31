const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const qaRouter = require('./routes/qa');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

app.use('/api/qa', qaRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 