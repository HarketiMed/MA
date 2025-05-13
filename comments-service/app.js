require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const commentRoutes = require('../comments-service/routes/commentroutes')
const app = express();

// MongoDB Connection
mongoose.connect('mongodb+srv://medharketi:medharketi@cluster0.u2jehj2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Middleware
app.use(express.json());

// Routes
app.use('/api/comments', commentRoutes);




module.exports = app;