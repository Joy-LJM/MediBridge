// model layer used for dealing with data in the database and connect with controllers
const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  prescription_id: {
    type: Number,
    // required: true
  },
  file: { type: String },
  doctor_id: {
    type: Number,
    //  required: true
  },
  pharmacy_id: {
    type: Number,
    // required: true
  },
  patient_id: {
    type: Number,
    //  required: true
  },
  delivery_status_id: { type: Number },
  uploaded_date: { type: Date },
  completed_date: { type: Date },
});
module.exports = mongoose.model("prescription", prescriptionSchema);
