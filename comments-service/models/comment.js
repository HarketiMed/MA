const mongoose = require('mongoose');
const { Schema } = mongoose;
const commentSchema = new Schema ({

   content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
})

module.exports = mongoose.model('comment', commentSchema);