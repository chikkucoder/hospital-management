import { initialPatients } from "./mockData";

const DATA_VERSION = 2; // Bump this when mockData structure changes

// Persist patients in localStorage for demo — version-aware cache
const storedVersion = localStorage.getItem("medico_patients_version");
if (!localStorage.getItem("medico_patients") || Number(storedVersion) !== DATA_VERSION) {
  localStorage.setItem("medico_patients", JSON.stringify(initialPatients));
  localStorage.setItem("medico_patients_version", String(DATA_VERSION));
}

const getPatients = () => JSON.parse(localStorage.getItem("medico_patients"));
const savePatients = (patients) => localStorage.setItem("medico_patients", JSON.stringify(patients));

export const patientService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return getPatients().filter(p => p.isActive !== false);
  },
  getById: async (id) => {
    const patients = getPatients();
    return patients.find(p => p.id === id || p.patientId === id);
  },
  create: async (data) => {
    const patients = getPatients();
    const newPatient = { 
      ...data, 
      id: String(Date.now()),
      patientId: `PAT-${Date.now().toString().slice(-6)}`,
      isActive: true,
      lastVisitDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    patients.push(newPatient);
    savePatients(patients);
    return newPatient;
  },
  update: async (id, data) => {
    const patients = getPatients();
    const index = patients.findIndex(p => p.id === id || p.patientId === id);
    if (index !== -1) {
      patients[index] = { ...patients[index], ...data };
      savePatients(patients);
    }
    return patients[index];
  },
  softDelete: async (id) => {
    const patients = getPatients();
    const index = patients.findIndex(p => p.id === id || p.patientId === id);
    if (index !== -1) {
      patients[index].isActive = false;
      savePatients(patients);
    }
  },
};
