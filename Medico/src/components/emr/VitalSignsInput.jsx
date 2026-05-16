import { Heart, Activity, Thermometer, Weight, Ruler, Wind } from "lucide-react";

export default function VitalSignsInput({ vitalSigns, onChange }) {
    const updateField = (field, value) => {
        onChange({ ...vitalSigns, [field]: value });
    };

    const updateBP = (field, value) => {
        onChange({
            ...vitalSigns,
            bloodPressure: { ...vitalSigns.bloodPressure, [field]: value },
        });
    };

    const fields = [
        { key: "systolic", icon: Heart, placeholder: "Systolic", value: vitalSigns.bloodPressure?.systolic || "", onChange: (v) => updateBP("systolic", v), type: "number" },
        { key: "diastolic", icon: Heart, placeholder: "Diastolic", value: vitalSigns.bloodPressure?.diastolic || "", onChange: (v) => updateBP("diastolic", v), type: "number" },
        { key: "heartRate", icon: Activity, placeholder: "HR (bpm)", value: vitalSigns.heartRate || "", onChange: (v) => updateField("heartRate", v), type: "number" },
        { key: "temperature", icon: Thermometer, placeholder: "Temp (°F)", value: vitalSigns.temperature || "", onChange: (v) => updateField("temperature", v), type: "number", step: "0.1" },
        { key: "respiratoryRate", icon: Wind, placeholder: "RR (/min)", value: vitalSigns.respiratoryRate || "", onChange: (v) => updateField("respiratoryRate", v), type: "number" },
        { key: "oxygenSaturation", icon: Activity, placeholder: "SpO₂ (%)", value: vitalSigns.oxygenSaturation || "", onChange: (v) => updateField("oxygenSaturation", v), type: "number" },
        { key: "weight", icon: Weight, placeholder: "Weight (kg)", value: vitalSigns.weight || "", onChange: (v) => updateField("weight", v), type: "number", step: "0.1" },
        { key: "height", icon: Ruler, placeholder: "Height (cm)", value: vitalSigns.height || "", onChange: (v) => updateField("height", v), type: "number", step: "0.1" },
    ];

    return (
        <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-3 block">
                Vital Signs
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {fields.map((f) => {
                    const Icon = f.icon;
                    return (
                        <div key={f.key} className="relative">
                            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                            <input
                                type={f.type || "number"}
                                step={f.step}
                                placeholder={f.placeholder}
                                value={f.value}
                                onChange={(e) => f.onChange(e.target.value)}
                                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}