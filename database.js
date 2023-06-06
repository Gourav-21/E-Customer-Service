const mongoose =require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')


exports.connectMongoose = ()=>{
    mongoose.connect('mongodb+srv://rahuldora21:!j8HNjW282WHLxT@ecs.hnwajal.mongodb.net/E-CustomerServiceDB')
    .then((e)=> console.log(`Connected to mongoDB:${e.connection.host}`))
    .catch((e)=> console.log(e))
}

const userSchema=new mongoose.Schema({
    name:String,
    phone_number:Number,
    email:String,
    password:String
})

userSchema.plugin(passportLocalMongoose)

exports.User =new mongoose.model("user",userSchema)

const UserMessage = new mongoose.Schema({
    name: String,
    email: String,
    phone_number:String,
    msg_subject: String,
    message: String
});

exports.Item = mongoose.model("Message", UserMessage);
