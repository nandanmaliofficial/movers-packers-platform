// to link on the controller
import '../models/connection.js';
import fs from "fs";
import url from "url";
import path from "path";


//to link usermodel on controller
import UserSchemaModel from '../models/user.model.js';

// //to link mail controller
// import sendMail from './email.controller.js';

//to link jwt
import jwt from 'jsonwebtoken';

//to link randomstring module
import rs from "randomstring";
import sendOTP from '../utils/sendotp.js';

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

export const save = async(req,res)=>{
  
    const user=await UserSchemaModel.find();
    const l=user.length;
    const _id=l==0?1:user[l-1]._id+1;

    const profileicon = req.files?.file;
    const profile = profileicon ? profileicon.name : "";
    // Generate 6 digit OTP
    let otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    

    // OTP expiry (10 minutes)
    let otpExpires =
      new Date(Date.now() + 10 * 60 * 1000);
    


    const UserDetails={...req.body,'_id':_id,'status':"true", 'otp':otp,'otpExpires':otpExpires, ProfilePic:profile};

    try{
      // Send OTP Email
      // await sendOTP(UserDetails.email, otp);
        await UserSchemaModel.create(UserDetails);
        if (profileicon) {
          const uploadPath = path.join(
                __dirname,
                "../../ui/public/assets/uploads/ProfileImage",
                profile,
              );
          await profileicon.mv(uploadPath);
        }
        res.status(201).json({'success':true,UserDetails});
        
    }
    catch(error){
      console.log(error)
        res.status(500).json({'status':false});
    }
};

export const fetch=async(req,res)=>{
  const userList=await UserSchemaModel.find(req.query);
  
  if(userList.length!=0){
    res.status(200).json(userList);
  }
  else
    res.status(404).json({"status":false},userList);    
};


export const deleteUser=async(req,res)=>{
  try{
    let userDetails = await UserSchemaModel.findOne(req.body.condition_obj);
    if(userDetails){
      let user=await UserSchemaModel.deleteOne(req.body.condition_obj);   
    
      if(user){
        const iconPath = path.join(__dirname, "../../ui/public/assets/uploads/ProfileImage");
                if (fs.existsSync(iconPath)) {
                  fs.unlinkSync(iconPath);
                }
        res.status(200).json({"status":true});
      }
    }
    else
      res.status(404).json({"status":false});
  }catch(error){
    };
};  


export var update=async(req,res)=>{
  try{
    const conditionObj = typeof req.body.condition_obj === "string"
      ? JSON.parse(req.body.condition_obj)
      : req.body.condition_obj;

    const contentObj = typeof req.body.content_obj === "string"
      ? JSON.parse(req.body.content_obj)
      : req.body.content_obj;

    let userDetails = await UserSchemaModel.findOne(conditionObj);
    if(userDetails){
      const profileicon = req.files?.file;

      if (profileicon) {
        const profile = profileicon.name;
        const uploadPath = path.join(
          __dirname,
          "../../ui/public/assets/uploads/ProfileImage",
          profile,
        );

        if (userDetails.ProfilePic) {
          const oldIconPath = path.join(__dirname, "../../ui/public/assets/uploads/ProfileImage", userDetails.ProfilePic);
          if (fs.existsSync(oldIconPath)) {
            fs.unlinkSync(oldIconPath);
          }
        }

        await profileicon.mv(uploadPath);
        contentObj.ProfilePic = profile;
      } else if (typeof contentObj.ProfilePic === "string" && contentObj.ProfilePic === "" && userDetails.ProfilePic) {
        const oldIconPath = path.join(__dirname, "../../ui/public/assets/uploads/ProfileImage", userDetails.ProfilePic);
        if (fs.existsSync(oldIconPath)) {
          fs.unlinkSync(oldIconPath);
        }
        contentObj.ProfilePic = "";
      }

      let user=await UserSchemaModel.updateMany(conditionObj,{$set:contentObj}); 
      if(user){  
        res.status(200).json({"status":true,"msg":"User details updated"});
      }else
        res.status(500).json({"status": false});
    }
    else
      res.status(404).json({"status":false,"msg":"Requested resource not available"});
  }catch(error){
    res.status(500).json({"status":false,"msg":"Server error"});        
  };
};  

export const login=async(req,res)=>{
  try{
      if(req.body.email!=undefined)
  { 
   var userDetails={...req.body};
   var users=await UserSchemaModel.find(userDetails);     
   
    if(users.length>0)
   {
    if(users[0].status){ 
    const payload=users[0].username;
    const key=rs.generate(50);
    const token=jwt.sign(payload,key); 
    res.status(200).json({"success":true,"token":token,"users":users[0],"message":"Login Successful"});
   }
   else
    // Generate 6 digit OTP
    var otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    

    // OTP expiry (10 minutes)
    var otpExpires =
      new Date(Date.now() + 10 * 60 * 1000);
    
      
      await UserSchemaModel.updateMany({email:users[0].email},{$set:{otp:otp,otpExpires:otpExpires}}); 
    await sendOTP(users[0].email, otp);
    res.status(403).json({"success":false,"token":"error","message":"Not Verified"})
}
else{
  res.status(404).json({"success":false,"token":"error","message":"Invalid Details"});
}
   
  }
}
  catch(error)
  {
    console.log(error);
   res.status(500).json({"success":false,"token":"error","message":"Server Error"});
 }};


 //verify-otp
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const user = await UserSchemaModel.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  if (user.otp !== otp) {
    return res.status(400).json({
      message: "Invalid OTP"
    });
  }

  if (new Date() > user.otpExpires) {
    return res.status(401).json({
      message: "OTP expired"
    });
  }

  user.status = true;
  user.otp = null;
  user.otpExpires = null;

  await user.save();

  res.json({
    message: "Email verified successfully"
  });
};

//resend otp controller

export const resendOTP = async (req, res) => {

    try {

        const { email } = req.body;

    // Generate 6 digit OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    

    // OTP expiry (10 minutes)
    const otpExpires =
      new Date(Date.now() + 10 * 60 * 1000);

      await UserSchemaModel.updateMany({email:email},{$set:{otp:otp,otpExpires:otpExpires}})

        await sendOTP(
            email,
            otp
        );

        res.status(200).json({

            success: true,
            message: "OTP Resent",

        });

    } catch (error) {

      console.log(error)
        res.status(500).json({
            message:
                error.message,
        });

    }

};
