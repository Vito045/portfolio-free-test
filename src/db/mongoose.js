const mongoose = require('mongoose');

mongoose.connect('mongodb://user:qwerty123@ds135726.mlab.com:35726/heroku_t1dxs30g', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true
});
