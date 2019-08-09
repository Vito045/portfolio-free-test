const mongoose = require('mongoose');
// const validator = require('validator');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

const projectTextSchema = new mongoose.Schema({
    title: {
        type: String,
        default: 'Title'
    }, 
    info: {
        type: String,
        default: 'Info'
    }
}, {
    timestamps: { 
        createdAt: 'created_at'
    }
});

const ProjectText = mongoose.model('ProjectText', projectTextSchema);

module.exports = ProjectText;