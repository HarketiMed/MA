const mongoose = require('mongoose');
const { Schema } = mongoose;
const commentSchema = new Schema ({

    content :{

        type:String,
        index :true
    }
})

module.exports = mongoose.model('comment', commentSchema);