const mongoose = require('mongoose');
// const validator = require('validator');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

const siteTextSchema = new mongoose.Schema({
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
            default: 'https://google.com'
        }
    }]
}, {
    timestamps: { 
        createdAt: 'created_at'
    }
});

const SiteText = mongoose.model('SiteText', siteTextSchema);

module.exports = SiteText;