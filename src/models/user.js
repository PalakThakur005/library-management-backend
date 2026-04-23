import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    password:{
        type:String,
        trim:true,
        required:true,
        minlength:6
    },
    role:{
        type:String,
        enum:["admin","teacher","student"],
        default:"admin"
    },
    department: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Department"
},
 card: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Card"
},
book: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Book"
},
    status: {
  type: String,
  enum: ["active", "inactive"],
  default: "active"
}  ,
profileImage: {
  type: String,
  default: "",
},
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[1-9]\d{9,14}$/, "Invalid phone number"],
  }, 
},
{timestamps:true}
);
const User= mongoose.model("User" , userSchema)
// now the Data is collection name in mongoDb and userSchema stored inside  the collection name

export default User;