let mongoose = require('mongoose');
let Utils = require('../Utils.js');
const Schema = mongoose.Schema;
const UserSchema = new Schema(
    {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        email: { type: String, required: true },
        pass: { type: String, required: true },
        admin: { type: Boolean },
        reviews: { type: Array }
    },
    {
        versionKey: false
    }
);

// encrypt password
UserSchema.pre('save', function(next) {
  // check if password is present and is modified
  if( this.pass && this.isModified() ) {
    this.pass = Utils.hashPass(this.pass);
  }
  next();
});


let User = mongoose.model('User', UserSchema, 'Users');

module.exports = User;
