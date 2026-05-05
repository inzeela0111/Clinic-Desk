import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type : String,
    required : [true , "Please Enter Your Name"]
},
  email: { 
    type: String, 
    required : [true , "Please Enter Your Email"],
    unique: true 
},
phone : { 
    type: String, 
    required : [true , "Please Enter Your Phone"],
    unique: true 
},
  password: {
    type : String,
    required : [true , "Please Enter Your Password"]
},
 image: {
      type: String,
      required : false,
      // default: "",
    },
     gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    default: "Other"
  },
isAdmin :{
    type : Boolean,
    required : true ,
    default : false
},
isActive : {
    type : Boolean,
    required : true ,
    default : true
},

},{
    timestamps: true
});


const user = mongoose.model("User" , userSchema)
 
export default user