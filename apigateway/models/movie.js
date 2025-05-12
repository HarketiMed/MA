const mongoose = require('mongoose');
const { Schema } = mongoose;

const movieSchema = new Schema({
  title: {
    type: String,
    
  },
  description: String,
  releaseYear: Number,
  // other fields...
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);