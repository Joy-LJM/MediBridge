// model layer used for dealing with data in the database and connect with controllers
const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  prescription_id: {
    type: String,
    // required: true
  },
  file: { type: String },
  doctor_id: {
    type: String,
    //  required: true
  },
  pharmacy_id: {
    type: String,
    // required: true
  },
  patient_id: {
    type: String,
    //  required: true
  },
  delivery_status_id: { type: Number },
  uploaded_date: { type: Date },
  completed_date: { type: Date },
  remark: { type: String },
});

const userSchema = new mongoose.Schema({
  firstname: { type: String },
  lastname: { type: String },
  account: { type: String },
});
const User = mongoose.model("user", userSchema);
const Prescription = mongoose.model("prescription", prescriptionSchema);
module.exports = { Prescription, User };
