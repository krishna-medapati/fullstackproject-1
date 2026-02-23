const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/shifts', require('./routes/shifts'));
app.use('/api/shifts', require('./routes/shifts'));
app.use('/api/applications', require('./routes/applications'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(process.env.PORT || 5000, () => console.log('Server running on port 5000'));
  })
  .catch(err => console.log(err));
