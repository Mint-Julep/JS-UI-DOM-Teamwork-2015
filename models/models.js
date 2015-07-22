var mongoose=require('mongoose'),
    Schema= mongoose.Schema;

var UserSchema=new Schema({
    id:Number,
    name:String,
    pass:String,
    rank:Number,
    weapon:String
});

mongoose.model('users',UserSchema);


