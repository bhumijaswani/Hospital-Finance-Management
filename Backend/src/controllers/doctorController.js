import { getAllDoctors,getDoctorById } from "../models/doctorModel.js";

export const fetchAllDoctors=async(req,res)=>{
  try{
    const doctors=await getAllDoctors();
    res.status(200).json(doctors);
  }
  catch(err){
    console.log(err);
    res.status(500).send({
      message:"Server error while fetching doctors"
    });
  }
}
export const fetchDoctorById=async(req,res)=>{
  try{
    const doctor=await getDoctorById(req.params.id);
    if(!doctor){
      return res.status(404).json({
        message:"Doctor not found"
      });
    }
    return res.status(200).json(doctor);
  }
  catch(err){
    console.log(err);
    res.status(500).send({
      message:"Server error while fetching doctor"
    });
  }
}