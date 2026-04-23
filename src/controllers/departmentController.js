    import {Department} from "../models/department.js";
    import { departmentAddedEmail } from "../services/mail.js";
import { sendEmail } from "../utils/sendEmail.js";

    export const addDepartment = async( req , res) => {
    try{
    const { name, description, location ,status} = req.body;

    if (!name) {
        return res.status(400).json({ message: "Department name is required" });
        }

        const exists = await Department.findOne({ name: name.trim() });

    if (exists) {
    return res.status(400).json({ message: "Department already exists" });
    }

    if (!name || name.trim().length < 3) {
    return res.status(400).json({ message: "Invalid department name" });
    }

        const prefix = name.replace(/\s+/g, "").substring(0, 3).toUpperCase();
        console.log(prefix , "prefix====")

        const count = await Department.countDocuments();

        const  number = String(count+1).padStart(2 , "0");

        const code = `DEP-${prefix}-${number}`;

        const newDepartment = new Department({
        name,
        code,
        description,
        location,
        status:"active"

        });
console.log(newDepartment,"====new")
        await newDepartment.save();

        await sendEmail({
  to: process.env.EMAIL_USER, 
  subject: "🏢 New Department Created",
  html: departmentAddedEmail(
    newDepartment.name,
    newDepartment.code,
    newDepartment.location,
    newDepartment.description
  ),
});

        res.status(201).json({
        message: "Department added successfully",
        newDepartment,
        });

    }catch(error){
        return res.status(500).json({ message: error.message });
    }
    }


    // get departement

    export  const getDepartment = async(req,res) => {
        try{
            const  department =  await Department.find().sort({createdAt:-1});

            return res.status(200).json(department);

        }catch(error){
            return res.status(500).json({ message: error.message });
        }
    }


    // active inactive

    export const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findById(id);

    if (!department) {
      return res.status(404).json({ message: "department not found" });
    }
   

    department.status = department.status === "active" ? "inactive" : "active";

    await department.save();

    return res.status(200).json({
      message: "Status updated",
      department
    });

  } catch (error) {
    console.log("TOGGLE ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
    }


    //update


export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, location, status } = req.body;

    const department = await Department.findById(id);

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }


       department.name = name;
    department.description = description;
  department.location = location;
   department.status = status;

    await department.save();

    return res.status(200).json(
  "Department updated successfully"
    );

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Pagination

export const pagination = async(req , res) => {

  try{
 const page = parseInt(req.query.page);
 const limit = parseInt(req.query.limit);
 const skip = (page-1)*limit;
 
 const departments = await Department.find().skip(skip).limit(limit).sort({createdAt:-1});
 const total = await Department.countDocuments()
 const totalPages=Math.ceil(total/limit)

return res.json({
  page,
  limit,
  total,
  totalPages,
  data: departments
})
  }catch(error){
return res.status(500).json({
      message: error.message,
    });
  }
}


// department

export const getDashboardStats=async(req,res)=>{
  try{
   const totalCount=await Department.countDocuments();
     const activeDepartment = await Department.countDocuments({
      status: "active"
    });
    const inactiveDepartment = await Department.countDocuments({
      status: "inactive"
    });
    return res.json({
      total: totalCount,
      active: activeDepartment,
      inactive: inactiveDepartment
     })
  }
  catch(error){
   return res.status(500).json({message:error.message})
  }
}