const express = require("express");
const patientController = require("../controllers/patientController");

const router = express.Router();

router.get("/", patientController.listPatients);
router.post("/", patientController.createPatient);

module.exports = router;
