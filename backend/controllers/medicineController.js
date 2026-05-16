const Medicine = require("../models/Medicine");

exports.createMedicine = async (req, res) => {
  try {
    const {
      name,
      sku,
      description,
      category,
      manufacturer,
      price,
      stock,
      threshold,
      unit,
      strength,
      requiresPrescription,
      sideEffects,
      contraindications,
      dosageForm,
    } = req.body;

    // Check if medicine with SKU already exists
    const existingMedicine = await Medicine.findOne({ sku });
    if (existingMedicine) {
      return res.status(400).json({
        success: false,
        message: "Medicine with this SKU already exists",
      });
    }

    const medicine = new Medicine({
      name,
      sku,
      description,
      category,
      manufacturer,
      price,
      stock,
      threshold,
      unit,
      strength,
      requiresPrescription,
      sideEffects,
      contraindications,
      dosageForm,
    });

    await medicine.save();

    res.status(201).json({
      success: true,
      data: medicine,
      message: "Medicine created successfully",
    });
  } catch (error) {
    console.error("Error creating medicine:", error);
    res.status(500).json({
      success: false,
      message: "Error creating medicine",
      error: error.message,
    });
  }
};

exports.getMedicines = async (req, res) => {
  try {
    const { category, search, isActive, lowStock, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (lowStock === "true") {
      filter.$expr = { $lte: ["$stock", "$threshold"] };
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
        { manufacturer: { $regex: search, $options: "i" } },
      ];
    }

    const medicines = await Medicine.find(filter)
      .sort({ name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Medicine.countDocuments(filter);

    res.json({
      success: true,
      data: {
        medicines,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalMedicines: total,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching medicines:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching medicines",
      error: error.message,
    });
  }
};

exports.getMedicineById = async (req, res) => {
  try {
    const { id } = req.params;

    const medicine = await Medicine.findById(id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    res.json({
      success: true,
      data: medicine,
    });
  } catch (error) {
    console.error("Error fetching medicine:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching medicine",
      error: error.message,
    });
  }
};

exports.updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const medicine = await Medicine.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    res.json({
      success: true,
      data: medicine,
      message: "Medicine updated successfully",
    });
  } catch (error) {
    console.error("Error updating medicine:", error);
    res.status(500).json({
      success: false,
      message: "Error updating medicine",
      error: error.message,
    });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock, operation } = req.body; // operation: 'add', 'subtract', 'set'

    const medicine = await Medicine.findById(id);
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    let newStock;
    switch (operation) {
      case "add":
        newStock = medicine.stock + stock;
        break;
      case "subtract":
        newStock = Math.max(0, medicine.stock - stock);
        break;
      case "set":
        newStock = stock;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid operation. Use 'add', 'subtract', or 'set'",
        });
    }

    medicine.stock = newStock;
    await medicine.save();

    // Check if stock is below threshold
    const isLowStock = newStock <= medicine.threshold;

    res.json({
      success: true,
      data: {
        medicine,
        isLowStock,
      },
      message: "Stock updated successfully",
    });
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({
      success: false,
      message: "Error updating stock",
      error: error.message,
    });
  }
};

exports.getLowStockMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({
      $expr: { $lte: ["$stock", "$threshold"] },
      isActive: true,
    }).sort({ stock: 1 });

    res.json({
      success: true,
      data: medicines,
    });
  } catch (error) {
    console.error("Error fetching low stock medicines:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching low stock medicines",
      error: error.message,
    });
  }
};
