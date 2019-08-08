const mongoose = require('mongoose');
// const validator = require('validator');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

const siteSchema = new mongoose.Schema({
    photo: {
        name: {
            type: String,
            default: 'none'
        },
        image: {
            type: Buffer
        }
    },
    name: {
        type: String,
        default: 'Name'
    }, 
    position: {
        type: String,
        default: 'Position'
    }, 
    info: {
        type: String,
        default: 'Info'
    },
    list: [{
        type: String,
        default: ' '
    }],
    contact: [{
        icon: {
            type: String,
            default: '_'
        },
        link: {
            type: String,
            default: 'https://gogle.com'
        }
    }]
}, {
    timestamps: { 
        createdAt: 'created_at'
    }
});

const Site = mongoose.model('Site', siteSchema);

module.exports = Site;