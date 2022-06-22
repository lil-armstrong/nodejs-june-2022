"use strict"
// user.model.js

const mongoose = require('mongoose');

  const UserSchema = new mongoose.Schema({
    email: {type: String, unique: true},
    password: String,
    username: String,
    firstName: {
    	required: true,
    	type: String
    },
    lastName: {
    	required: true,
    	type: String
    }
  })

  module.exports = mongoose.model('User', UserSchema)