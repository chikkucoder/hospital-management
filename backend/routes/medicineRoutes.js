const express = require("express");
const router = express.Router();
const medicineController = require("../controllers/medicineController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Medicine Routes
router.post(
  "/medicines",
  authMiddleware,
  roleMiddleware(["PHARMACY", "ADMIN"]),
  medicineController.createMedicine
);

router.get(
  "/medicines",
  authMiddleware,
  medicineController.getMedicines
);

router.get(
  "/medicines/:id",
  authMiddleware,
  medicineController.getMedicineById
);

router.put(
  "/medicines/:id",
  authMiddleware,
  roleMiddleware(["PHARMACY", "ADMIN"]),
  medicineController.updateMedicine
);

router.put(
  "/medicines/:id/stock",
  authMiddleware,
  roleMiddleware(["PHARMACY", "ADMIN"]),
  medicineController.updateStock
);

router.get(
  "/medicines/low-stock/alerts",
  authMiddleware,
  roleMiddleware(["PHARMACY", "ADMIN"]),
  medicineController.getLowStockMedicines
);

module.exports = router;
