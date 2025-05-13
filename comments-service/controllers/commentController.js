const Comment = require('../models/comment');

// Create a new comment
exports.createComment = async (req, res) => {
    try {
        const { content } = req.body;
        const newComment = new Comment({ content });
        await newComment.save();
        res.status(201).json(newComment);
    } catch (err) {
        res.status(500).json({ error: err.message });
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
