const { Comment } = require('../models/comment');
const { Kafka } = require('kafkajs');

// Initialize Kafka producer (single instance)
const kafka = new Kafka({
  clientId: 'comment-service',
  brokers: [process.env.KAFKA_BROKERS || 'localhost:9092']
});
const producer = kafka.producer();

// Connect producer at startup
(async () => {
  try {
    await producer.connect();
    console.log('Connected to Kafka');
  } catch (err) {
    console.error('Could not connect to Kafka:', err);
  }
})();

exports.createComment = async (req, res) => {
  try {
    
    // 2. Create and save comment
 
    // 3. Prepare Kafka message
    const kafkaMessage = {
      type: 'COMMENT_CREATED',
      data: {
        
        content: req.body,
        
      }
    };

    // 4. Send to Kafka
    await producer.send({
      topic: 'sentiment-results',
      messages: [{ value: JSON.stringify(kafkaMessage) }]
    });

    // 5. Return response
    res.status(201).json({
      success: true,
      comment: req.body
    });

  } catch (err) {
    console.error('Error in createComment:', err);
    
    // Handle specific error types
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation error',
        details: err.errors 
      });
    }
    
    res.status(500).json({ 
      error: 'Internal server error',
      message: err.message 
    });
  }
};
// Get all comments
exports.getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find();
        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a single comment by ID
exports.getCommentById = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });
        res.json(comment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a comment
exports.updateComment = async (req, res) => {
    try {
        const { content } = req.body;
        const updatedComment = await Comment.findByIdAndUpdate(
            req.params.id,
            { content },
            { new: true }
        );
        if (!updatedComment) return res.status(404).json({ message: 'Comment not found' });
        res.json(updatedComment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
    try {
        const deletedComment = await Comment.findByIdAndDelete(req.params.id);
        if (!deletedComment) return res.status(404).json({ message: 'Comment not found' });
        res.json({ message: 'Comment deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
