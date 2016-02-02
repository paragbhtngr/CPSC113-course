var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/social-todo');

var Schema = mongoose.Schema,
    ObjectID = Schema.ObjectID;

var UserSchema = new Schema({
  email: String,
  name: String,
  hashed_password: String
});

UserSchema.statics.count = function count (cb) {
  return this.model('Users').find({}, cb);
};

module.exports = mongoose.model('Users', UserSchema);
