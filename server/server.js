const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const cors = require('cors'); 
require('dotenv').config();

// 1. INITIALIZE THE APP
const app = express(); 

// 2. MIDDLEWARE
app.use(cors()); 
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

// 3. IMPORT ROUTES
const authRoutes = require('./routes/auth');
const resourceRoutes = require('./routes/resources');
const expertRoutes = require('./routes/experts');
const postRoutes = require('./routes/posts'); 
const chatRoutes = require('./routes/chat');
const alertRoutes = require('./routes/alerts');
const resiliencyRoutes = require('./routes/resiliency');

// 4. ATTACH THE ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/experts', expertRoutes);
app.use('/api/posts', postRoutes); 
app.use('/api/chat', chatRoutes); 
app.use('/api/alerts', alertRoutes);
app.use('/api/resiliency', resiliencyRoutes);

// 5. CONNECT TO MONGODB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB Connected Successfully"))
  .catch(err => console.log(" MongoDB Connection Error:", err));

// 6. FOLDER & SERVER START
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});