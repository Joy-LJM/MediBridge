const {
  submitPrescription,
  getPatientList,
} = require("../controllers/doctorDashboardController");

// The top-level express object has a Router() method that creates a new router object. Once you’ve created a router object, you can add middleware and HTTP method routes (such as get, put, post, and so on) to it just like an application.
const router = require("express").Router();

router.post("/submit", submitPrescription);
router.get("/patient", getPatientList);

module.exports = router;
