import React from "react";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { medicineSchema } from "../../lib/validationSchemas";
import { PlusIcon, TrashIcon, PillIcon } from "@heroicons/react/24/outline";

// Validation schema for the medicine array
const prescriptionBuilderSchema = z.object({
  medicines: z.array(medicineSchema).min(1, "At least one medicine is required"),
});

const PrescriptionBuilder = ({ value = [], onChange, errors = {} }) => {
  // Initialize form with controlled values
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      medicines: value.length > 0 ? value : [{ name: "", dosage: "", duration: "" }],
    },
    resolver: zodResolver(prescriptionBuilderSchema),
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "medicines",
  });

  // Add new medicine row
  const addMedicine = () => {
    append({ name: "", dosage: "", duration: "" });
  };

  // Remove medicine row (keep at least one)
  const removeMedicine = (index) => {
    if (fields.length > 1) {
      const newMedicines = value.filter((_, i) => i !== index);
      onChange(newMedicines);
      remove(index);
    }
  };

  // Handle field changes
  const handleFieldChange = (index, fieldName, fieldValue) => {
    const newMedicines = [...value];
    if (!newMedicines[index]) {
      newMedicines[index] = { name: "", dosage: "", duration: "" };
    }
    newMedicines[index][fieldName] = fieldValue;
    onChange(newMedicines);
  };

  // Handle blur for validation
  const handleBlur = (index, fieldName) => {
    const medicine = value[index] || {};
    if (fieldName === "name" && !medicine.name?.trim()) {
      // Trigger validation error
      return;
    }
  };

  return (
    <div className="w-full lg:w-1/4 bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Prescription</h3>
        <PillIcon className="h-5 w-5 text-blue-500" />
      </div>

      <div className="space-y-4">
        {/* Medicines Header */}
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Medicines <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={addMedicine}
            className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add medicine
          </button>
        </div>

        {/* Medicine Rows */}
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="border border-gray-200 rounded-lg p-3 space-y-3">
              {/* Row Header */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Medicine {index + 1}</span>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMedicine(index)}
                    className="p-1 text-red-500 hover:text-red-700 transition-colors"
                    title="Remove medicine"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Medicine Fields */}
              <div className="space-y-3">
                {/* Medicine Name */}
                <div>
                  <Controller
                    name={`medicines.${index}.name`}
                    control={control}
                    render={({ field, fieldState }) => (
                      <div>
                        <input
                          {...field}
                          type="text"
                          placeholder="Medicine name"
                          value={value[index]?.name || ""}
                          onChange={(e) => {
                            field.onChange(e);
                            handleFieldChange(index, "name", e.target.value);
                          }}
                          onBlur={() => {
                            field.onBlur();
                            handleBlur(index, "name");
                          }}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${fieldState.error ? "border-red-300" : "border-gray-300"
                            }`}
                        />
                        {fieldState.error && (
                          <p className="mt-1 text-xs text-red-600">
                            {fieldState.error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>

                {/* Dosage and Duration - Desktop Side by Side, Mobile Stacked */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Dosage */}
                  <div>
                    <Controller
                      name={`medicines.${index}.dosage`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="Dosage (e.g., 500mg twice daily)"
                          value={value[index]?.dosage || ""}
                          onChange={(e) => {
                            field.onChange(e);
                            handleFieldChange(index, "dosage", e.target.value);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      )}
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <Controller
                      name={`medicines.${index}.duration`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="Duration (e.g., 5 days)"
                          value={value[index]?.duration || ""}
                          onChange={(e) => {
                            field.onChange(e);
                            handleFieldChange(index, "duration", e.target.value);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Global Error */}
        {errors.medicines && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.medicines}</p>
          </div>
        )}

        {/* Instructions */}
        <div className="text-xs text-gray-500 bg-gray-50 rounded p-3">
          <p className="font-medium mb-1">Prescription Guidelines:</p>
          <ul className="space-y-1">
            <li>• Medicine name is required for all entries</li>
            <li>• Include specific dosage instructions</li>
            <li>• Specify treatment duration clearly</li>
            <li>• At least one medicine must be prescribed</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionBuilder;
