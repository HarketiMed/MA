require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');


const app = express();

// Middleware
app.use(express.json());






module.exports = app;