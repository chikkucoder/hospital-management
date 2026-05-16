const LabTest = require("../models/LabTest");
const LabReport = require("../models/LabReport");

// Lab Test Controllers
exports.createLabTest = async (req, res) => {
  try {
    const {
      name,
      code,
      category,
      description,
      price,
      normalRange,
      preparationInstructions,
      sampleType,
      department,
      turnaroundTime,
    } = req.body;

    // Check if lab test with code already exists
    const existingTest = await LabTest.findOne({ code });
    if (existingTest) {
      return res.status(400).json({
        success: false,
        message: "Lab test with this code already exists",
      });
    }

    const labTest = new LabTest({
      name,
      code,
      category,
      description,
      price,
      normalRange,
      preparationInstructions,
      sampleType,
      department,
      turnaroundTime,
    });

    await labTest.save();

    res.status(201).json({
      success: true,
      data: labTest,
      message: "Lab test created successfully",
    });
  } catch (error) {
    console.error("Error creating lab test:", error);
    res.status(500).json({
      success: false,
      message: "Error creating lab test",
      error: error.message,
    });
  }
};

exports.getLabTests = async (req, res) => {
  try {
    const { category, department, search, isActive, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (department) filter.department = department;
    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
      ];
    }

    const labTests = await LabTest.find(filter)
      .sort({ name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await LabTest.countDocuments(filter);

    res.json({
      success: true,
      data: {
        labTests,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalTests: total,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching lab tests:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching lab tests",
      error: error.message,
    });
  }
};

exports.getLabTestById = async (req, res) => {
  try {
    const { id } = req.params;

    const labTest = await LabTest.findById(id);

    if (!labTest) {
      return res.status(404).json({
        success: false,
        message: "Lab test not found",
      });
    }

    res.json({
      success: true,
      data: labTest,
    });
  } catch (error) {
    console.error("Error fetching lab test:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching lab test",
      error: error.message,
    });
  }
};

// Lab Report Controllers
exports.createLabReport = async (req, res) => {
  try {
    const {
      patient,
      doctor,
      appointment,
      test,
      reportUrl,
      reportData,
      priority,
      notes,
    } = req.body;

    // Verify test exists
    const labTest = await LabTest.findById(test);
    if (!labTest) {
      return res.status(404).json({
        success: false,
        message: "Lab test not found",
      });
    }

    const labReport = new LabReport({
      patient,
      doctor,
      appointment,
      test,
      reportUrl,
      reportData,
      priority,
      notes,
      uploadedBy: req.user.id, // Assuming user is attached from auth middleware
    });

    await labReport.save();

    // Populate related data for response
    await labReport.populate([
      { path: "patient", select: "name age gender" },
      { path: "doctor", select: "name specialty" },
      { path: "test", select: "name code category" },
      { path: "uploadedBy", select: "name" },
    ]);

    res.status(201).json({
      success: true,
      data: labReport,
      message: "Lab report created successfully",
    });
  } catch (error) {
    console.error("Error creating lab report:", error);
    res.status(500).json({
      success: false,
      message: "Error creating lab report",
      error: error.message,
    });
  }
};

exports.getLabReports = async (req, res) => {
  try {
    const { patient, doctor, test, status, priority, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (patient) filter.patient = patient;
    if (doctor) filter.doctor = doctor;
    if (test) filter.test = test;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const labReports = await LabReport.find(filter)
      .populate("patient", "name age gender")
      .populate("doctor", "name specialty")
      .populate("test", "name code category")
      .populate("uploadedBy", "name")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await LabReport.countDocuments(filter);

    res.json({
      success: true,
      data: {
        labReports,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalReports: total,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching lab reports:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching lab reports",
      error: error.message,
    });
  }
};

exports.getLabReportById = async (req, res) => {
  try {
    const { id } = req.params;

    const labReport = await LabReport.findById(id)
      .populate("patient", "name age gender phone address")
      .populate("doctor", "name specialty qualification")
      .populate("test", "name code category description normalRange")
      .populate("uploadedBy", "name")
      .populate("reviewedBy", "name specialty");

    if (!labReport) {
      return res.status(404).json({
        success: false,
        message: "Lab report not found",
      });
    }

    res.json({
      success: true,
      data: labReport,
    });
  } catch (error) {
    console.error("Error fetching lab report:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching lab report",
      error: error.message,
    });
  }
};

exports.updateLabReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewedBy, notes } = req.body;

    const labReport = await LabReport.findByIdAndUpdate(
      id,
      {
        status,
        reviewedBy,
        notes,
        completedAt: status === "completed" ? Date.now() : undefined,
      },
      { new: true, runValidators: true }
    ).populate([
      { path: "patient", select: "name age gender" },
      { path: "doctor", select: "name specialty" },
      { path: "test", select: "name code category" },
      { path: "uploadedBy", select: "name" },
      { path: "reviewedBy", select: "name specialty" },
    ]);

    if (!labReport) {
      return res.status(404).json({
        success: false,
        message: "Lab report not found",
      });
    }

    res.json({
      success: true,
      data: labReport,
      message: "Lab report status updated successfully",
    });
  } catch (error) {
    console.error("Error updating lab report status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating lab report status",
      error: error.message,
    });
  }
};

exports.getPatientLabReports = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const labReports = await LabReport.find({ patient: patientId })
      .populate("doctor", "name specialty")
      .populate("test", "name code category")
      .populate("uploadedBy", "name")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await LabReport.countDocuments({ patient: patientId });

    res.json({
      success: true,
      data: {
        labReports,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalReports: total,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching patient lab reports:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching patient lab reports",
      error: error.message,
    });
  }
};
