var mongoose = require("mongoose"),
passportLocalMongoose = require("passport-local-mongoose");
var UserSchema = mongoose.Schema({
   username : String,
   passport:String
});
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);