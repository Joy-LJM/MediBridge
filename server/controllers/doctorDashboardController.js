const { Prescription, User } = require("../models/doctorDashboardModel");

module.exports.submitPrescription = async (req, res, next) => {
  try {
    const data = req.body;
    const prescription = new Prescription(data);
    prescription.save().then(() => {
      res.json({
        code: 1,
        message: "Prescription is submitted successfully!",
      });
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getPatientList = async (req, res, next) => {
  try {
    const patientList = await User.find({ account: "3" });
    const patientRes = patientList.map(
      ({ _id, firstname, lastname, account }) => {
        const res = { _id, firstname, lastname, account };
        return res;
      }
    );

    res.json({
      patientList: patientRes,
    });
  } catch (err) {
    next(err);
  }
};
