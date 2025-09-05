
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

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-4 mb-4 gap-4">
                <h2 className="text-xl font-semibold text-primary">Patient Management</h2>
                <div className="relative w-full md:w-72">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search patients..."
                        className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition"
                    />
                    <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
                <button onClick={onAddPatientClick} className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-sm">
                    <i className="fas fa-plus"></i> Add Patient
                </button>
                <button onClick={onScanCardClick} className="flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors shadow-sm">
                    <i className="fas fa-camera"></i> Scan Patient Card
                </button>
                <button onClick={generateSampleCards} className="flex items-center gap-2 px-4 py-2 bg-success text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors shadow-sm">
                    <i className="fas fa-id-card"></i> Generate Sample Cards
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                        <PatientCard key={patient.id} patient={patient} showToast={showToast} />
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500 py-8">No patients found.</p>
                )}
            </div>
        </div>
    );
};

export default Patients;
