var mongoose=require('mongoose'),
    Schema= mongoose.Schema;

var UserSchema=new Schema({
    id:Number,
    name:String,
    pass:String,
    rank:Number,
    weapon:String,
    token:String
});

var MapSchema = new Schema({
    id:Number,
    name:String,
    map:Array,
    tiles:Object,
    initialPosition:Object,
    bonuses:Array,
    bots:Array
});

mongoose.model('users',UserSchema);
mongoose.model('maps',MapSchema);


