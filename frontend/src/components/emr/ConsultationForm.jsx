import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { consultationFormSchema } from "../../lib/validationSchemas";
import { XIcon, PlusIcon } from "lucide-react";

const ConsultationForm = ({ onSubmit, isSubmitting }) => {
  const [symptoms, setSymptoms] = useState([]);
  const [symptomInput, setSymptomInput] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(consultationFormSchema),
    defaultValues: {
      diagnosis: "",
      symptoms: [],
      clinicalNotes: "",
    },
  });

  const addSymptom = () => {
    if (symptomInput.trim() && !symptoms.includes(symptomInput.trim())) {
      const newSymptoms = [...symptoms, symptomInput.trim()];
      setSymptoms(newSymptoms);
      setValue("symptoms", newSymptoms);
      setSymptomInput("");
    }
  };

  const removeSymptom = (indexToRemove) => {
    const newSymptoms = symptoms.filter((_, index) => index !== indexToRemove);
    setSymptoms(newSymptoms);
    setValue("symptoms", newSymptoms);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSymptom();
    }
  };

  const onFormSubmit = (data) => {
    onSubmit({
      ...data,
      symptoms: symptoms,
    });
  };

  return (
    <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Consultation Form</h3>
      
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Diagnosis */}
        <div>
          <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-2">
            Diagnosis <span className="text-red-500">*</span>
          </label>
          <textarea
            id="diagnosis"
            {...register("diagnosis")}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter primary diagnosis..."
          />
          {errors.diagnosis && (
            <p className="mt-1 text-sm text-red-600">{errors.diagnosis.message}</p>
          )}
        </div>

        {/* Symptoms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Symptoms
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={symptomInput}
              onChange={(e) => setSymptomInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter symptom and press Enter or click Add"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={addSymptom}
              disabled={!symptomInput.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
          
          {/* Symptoms Tags */}
          {symptoms.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {symptoms.map((symptom, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {symptom}
                  <button
                    type="button"
                    onClick={() => removeSymptom(index)}
                    className="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <XIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Clinical Notes */}
        <div>
          <label htmlFor="clinicalNotes" className="block text-sm font-medium text-gray-700 mb-2">
            Clinical Notes
          </label>
          <textarea
            id="clinicalNotes"
            {...register("clinicalNotes")}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter detailed clinical notes, observations, and recommendations..."
          />
          {errors.clinicalNotes && (
            <p className="mt-1 text-sm text-red-600">{errors.clinicalNotes.message}</p>
          )}
        </div>

        {/* Form Status */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {symptoms.length} symptom{symptoms.length !== 1 ? "s" : ""} added
            </div>
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                "Save Consultation"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ConsultationForm;
