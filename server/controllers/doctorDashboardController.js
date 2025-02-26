const Prescription = require("../models/doctorDashboardModel");

module.exports.submitPrescription = async (req, res, next) => {
  try {
    const data = req.body;

    const prescription = new Prescription(data);
    prescription.save().then((res) => {
      console.log(res, "res");
    });
  } catch (err) {
    next(err);
  }
};
module.exports.getPatientList = async (req, res, next) => {};
