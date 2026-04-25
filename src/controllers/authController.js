import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generatePassword from "../utils/generatePassword.js";
import { sendEmail } from "../utils/sendEmail.js";
import { registerEmail, resetPassword , ContactAdmin ,
  userUpdatedEmail  } from "../services/mail.js";
import { Department } from "../models/department.js";



// REGISTER USER
export const registerUser = async (req, res) => {
  try {

    const { name, email, role ,department , phone } = req.body;



    if (!role || !name || !email) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const plainPassword = generatePassword(10);
    console.log("Generated Password:", plainPassword);

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists"
      });
    }


    const user = await User.create({
      name,
      email,
      phone,
      department,
      password: hashedPassword,
      role:"student",
      status: "active"
    });

    const loginHtml = registerEmail(
      user.name.toUpperCase(),
      user.email,
      plainPassword
    )

      try {
      await sendEmail({
        to: email,
        subject: "Your account password",
       html: loginHtml
      });
    } catch (err) {
      console.log("Email error:", err.message);
    }

return res.status(201).json({
  message: "User created successfully",
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    department: user.department
  }      
  });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};



// LOGIN USER
export const loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Email"
      });
    }

    if (user.status === "inactive") {
      return res.status(403).json({
        message: "Your account is inactive. Please contact admin.",
      });
    }


    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password"
      });
    }

    const token = jwt.sign(
      { id: user._id ,role:user.role},
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
    console.log(role)

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};  

//card

export const getDashboardStats=async(req,res)=>{
  try{
   const totalCount=await User.countDocuments({role:{$ne:"admin"}});
   
    const studentCount=await User.countDocuments({role:"student"})
     const teacherCount=await User.countDocuments({role:"teacher"})
     const activeUsers = await User.countDocuments({
      status: "active",
      role: { $ne: "admin" }
    });
    

    return res.json({
      total: totalCount,
      student: studentCount,
      teacher:teacherCount,
      active: activeUsers,
     })
  }
  catch(error){
   return res.status(500).json({message:error.message})
  }
}

// user role get api


export const getUser = async (req, res) => {
  try {
    const fetchUser =  await User.find({
      role: { $ne: "admin" },
    })
    .populate("department" , "name")
    .sort({ createdAt: -1 });
    return res.status(200).json(fetchUser)
  } catch (error) {
    return res.status(500).json({ message: error.message   })
  }
}


//role delete api

export const deleteUser = async (req, res) => {
  try {
    const removeUser = await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "User Deleted Successfully" })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}


// user update (edit)

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, name, email, department } = req.body;

    const existingUser = await User.findById(id);

    if (!existingUser) {
      return res.status(404).json("User not found");
    }

    if (existingUser.role === "teacher" && role === "student") {
      return res.status(400).json({
        message: "Teacher cannot be changed to Student",
      });
    }

    let deptName = "N/A";

    if (department) {
      const dept = await Department.findById(department);
      deptName = dept?.name || "N/A";
    }

    existingUser.role = role;
    existingUser.name = name;
    existingUser.email = email;
    existingUser.department = department;

    await existingUser.save();

    try {
      await sendEmail({
        to: existingUser.email,
        subject: "User Profile Updated",
        html: userUpdatedEmail(
          existingUser.name,
          existingUser.email,
          existingUser.role,
          deptName   
        )
      });


    } catch (err) {
      console.log("❌ Email error:", err);
    }

    return res.status(200).json("User updated successfully");

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// active / inactive status

export const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
   

    user.status = user.status === "active" ? "inactive" : "active";

    await user.save();

    return res.status(200).json({
      message: "Status updated",
      user
    });

  } catch (error) {
    console.log("TOGGLE ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

// reset user password

export const resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
     if(user.status !== "active"){
      return res.status(404).json({message:"Account is inactive. Reset password not allowed."})
    }

    const newPassword = generatePassword(10);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();


    const emailHtml = resetPassword(
      user.name,
      user.email,
      newPassword
    );

    await sendEmail({
      to: user.email,
      subject: "Your Password Has Been Reset",
      html: emailHtml,
        
    });

    return res.status(200).json({
      message: "Password reset and sent to email"
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};




// CONTACT ADMIN API
export const contactAdmin = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }


    const contactHtml = ContactAdmin(
       name,
      email,
      message
    )

    await sendEmail({
      to: "pt49600@gmail.com", 
      subject: "Contact Admin Request",
      replyTo:email,
      html: contactHtml,
    });

    return res.status(200).json({
      message: "Message sent to admin successfully",
    });

  } catch (error) {
    console.log("CONTACT ADMIN ERROR:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};


// Pagination

export const pagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) ;
    const limit = parseInt(req.query.limit) ;
    const skip = (page - 1) * limit;

    const role = req.query.role;
    const search = req.query.search || "";

    let filter = {
  role: { $ne: "admin" }  
};

   
    if (role && role !== "all") {
      filter.role = role;
    }

if (search) {
  const normalizedSearch = search
    .toLowerCase()
    .replace(/[-_\s]+/g, "");

  filter.$or = [
    {
      name: {
        $regex: normalizedSearch.split("").join(".*"),
        $options: "i",
      },
    },
    { email: { $regex: search, $options: "i" } },
  ];
}

    const users = await User.find(filter)
      .populate("department") // optional
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    return res.json({
      success: true,
      page,
      limit,
      total,
      totalPages,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Token verification

export const tokenVerify=async(req,res)=>{
  const token =req.headers.authorization.split(" ")[1]
try{
  jwt.verify(token,process.env.JWT_SECRET)
  res.json({valid:true})
}
catch(error){
  res.json({valid:false})
}
}



//token get me 

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("department", "name code location ")
      .populate("card" , "cardNumber");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


import cloudinary from "../config/cloudinary.js";

export const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    
    const allowedFormats = ["image/jpeg", "image/png", "image/jpg"];

if (!allowedFormats.includes(req.file.mimetype)) {
  return res.status(400).json({
    message: "Invalid file type. Only JPG, JPEG, PNG allowed",
  });
} 

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "profile_images",
     allowed_formats: ["jpg", "png", "jpeg"],
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage: result.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);

  } catch (error) {
    console.log("UPLOAD ERROR:", error);
    res.status(500).json({  message: "Upload failed. Please upload a valid image file"});
  }
};



export const removeProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.profileImage = ""; // remove image
    await user.save();

    res.json({
      message: "Profile image removed",
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { name ,phone } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name: name?.trim(), 
       phone: phone?.trim() },
      { new: true }
    ).select("-password");

    await user.save();

    res.status(200).json({
  success: true,
  user
});

console.log(user)

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};