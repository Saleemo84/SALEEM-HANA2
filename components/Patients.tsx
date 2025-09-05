import React, { useState, useMemo } from 'react';
import type { Patient } from '../types';
import PatientCard from './PatientCard';

interface PatientsProps {
    patients: Patient[];
    onAddPatientClick: () => void;
    onScanCardClick: () => void;
    showToast: (message: string, type?: 'success' | 'error') => void;
}

const Patients: React.FC<PatientsProps> = ({ patients, onAddPatientClick, onScanCardClick, showToast }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPatients = useMemo(() => {
        if (!searchTerm) return patients;
        const lowercasedTerm = searchTerm.toLowerCase();
        return patients.filter(
            (patient) =>
                patient.name.toLowerCase().includes(lowercasedTerm) ||
                patient.phone.includes(lowercasedTerm) ||
                patient.code.toLowerCase().includes(lowercasedTerm)
        );
    }, [patients, searchTerm]);

    const generateSampleCards = () => {
        patients.forEach(patient => {
            const qrData = JSON.stringify(patient);
            console.log(`Patient Card for ${patient.name}:`, qrData);
        });
        showToast('Sample patient cards generated. Check console for QR data.');
    };

    const handleExport = () => {
        if (patients.length === 0) {
            showToast('No patient data to export.', 'error');
            return;
        }
    
        const headers = [
            "Name",
            "Phone",
            "Dates of Visits",
            "Total Payments (IQD)",
            "X-Ray Count"
        ];
    
        const patientData = patients.map(p => {
            const name = `"${p.name.replace(/"/g, '""')}"`;
            const phone = p.phone;
            const visits = `"${p.visits.join(', ')}"`;
            const totalPayments = p.totalPayments;
            const xrayCount = p.treatments?.filter(t => t.xrayUrl).length || 0;
            return [name, phone, visits, totalPayments, xrayCount].join(',');
        });
    
        const csvContent = [
            headers.join(','),
            ...patientData
        ].join('\n');
    
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `patient_data_export_${new Date().getFullYear()}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast('Patient data exported successfully!');
        }
    };

    const ActionButton: React.FC<{ onClick: () => void; icon: string; text: string; color: string; }> = ({ onClick, icon, text, color }) => (
        <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg ${color} transition-all duration-300 shadow-sm hover:shadow-lg transform hover:-translate-y-0.5`}>
            <i className={`fas ${icon}`}></i> {text}
        </button>
    );

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200/80 p-4 md:p-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-4 mb-6 gap-4">
                <h2 className="text-xl font-bold text-slate-800">Patient Management</h2>
                <div className="relative w-full md:w-72">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name, phone, or code..."
                        className="w-full pl-4 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary transition"
                    />
                    <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
                <ActionButton onClick={onAddPatientClick} icon="fa-plus" text="Add Patient" color="bg-primary hover:bg-primary-dark" />
                <ActionButton onClick={onScanCardClick} icon="fa-camera" text="Scan Card" color="bg-accent hover:bg-accent-dark" />
                <ActionButton onClick={generateSampleCards} icon="fa-id-card" text="Generate Samples" color="bg-amber-500 hover:bg-amber-600" />
                <ActionButton onClick={handleExport} icon="fa-file-excel" text="Export CSV" color="bg-green-500 hover:bg-green-600" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                        <PatientCard key={patient.id} patient={patient} showToast={showToast} />
                    ))
                ) : (
                    <p className="col-span-full text-center text-slate-500 py-8">No patients found.</p>
                )}
            </div>
        </div>
    );
};

export default Patients;