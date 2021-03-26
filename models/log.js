const mongoose = require('mongoose')
require('dotenv').config()

UserSchema = new mongoose.Schema({
    id: {type: String, required: true},
    user: {type: String, required: true},
    event: {type: String, required: true},
    body: {type: String, required: true}
}, {timestamps:true})

mongoose.model('Log', UserSchema)

mongoose.connect(process.env.URI,{ useNewUrlParser: true })