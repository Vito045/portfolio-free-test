const mongoose = require('mongoose');
// const validator = require('validator');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        default: 'Title'
    }, 
    info: {
        type: String,
        default: 'Info'
    },
    media: [{
        data: {
            type: Buffer,
            // type: String,
            // default: ' '
        },
        type: {
            type: String,
            default: 'none'
        }
    }]
}, {
    timestamps: { 
        createdAt: 'created_at'
    }
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;