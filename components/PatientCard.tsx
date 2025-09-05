
import React from 'react';
import type { Patient } from '../types';

interface PatientCardProps {
    patient: Patient;
    showToast: (message: string, type?: 'success' | 'error') => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, showToast }) => {

    const callPatient = () => {
        showToast(`Calling ${patient.name} at ${patient.phone}...`);
        // In a real app, this would use tel: link
    };

    const whatsappPatient = () => {
        showToast(`Opening WhatsApp for ${patient.name}...`);
        // In a real app, this would open a WhatsApp link
    };
    
    const viewDetails = () => {
        showToast(`Viewing details for ${patient.name}`);
        // In a real app, this would open a patient details modal
    };
    
    return (
        <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-primary transition-all duration-300 hover:shadow-md hover:-translate-y-1 animate-slideUp">
            <h3 className="font-bold text-lg text-gray-800">{patient.name}</h3>
            <span className="inline-block bg-primary-light text-primary-dark text-xs font-semibold px-2 py-1 rounded-md mb-4">{patient.code}</span>
            
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="font-medium text-gray-500">Phone:</span>
                    <span className="text-gray-700">{patient.phone}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium text-gray-500">Last Visit:</span>
                    <span className="text-gray-700">{patient.lastVisit}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium text-gray-500">Balance:</span>
                    <span className={`font-semibold ${patient.balance > 0 ? 'text-error' : 'text-success'}`}>{patient.balance.toLocaleString()} IQD</span>
                </div>
            </div>

            <div className="flex gap-2 mt-4 flex-wrap">
                 <button onClick={callPatient} className="flex-1 text-center text-xs px-3 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
                    <i className="fas fa-phone mr-1"></i> Call
                </button>
                <button onClick={whatsappPatient} className="flex-1 text-center text-xs px-3 py-2 bg-success text-white rounded-md hover:bg-green-600 transition-colors">
                    <i className="fab fa-whatsapp mr-1"></i> WhatsApp
                </button>
                <button onClick={viewDetails} className="flex-1 text-center text-xs px-3 py-2 bg-accent text-white rounded-md hover:bg-teal-600 transition-colors">
                    <i className="fas fa-eye mr-1"></i> Details
                </button>
            </div>
        </div>
    );
};

export default PatientCard;
