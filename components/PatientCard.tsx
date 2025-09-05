import React, { useMemo } from 'react';
import type { Patient, ToothStatus } from '../types';
import { STATUS_CONFIG } from '../constants';

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

    const chartSummary = useMemo(() => {
        if (!patient.teethChart) return null;

        const summary = Object.values(patient.teethChart).reduce((acc, toothData) => {
            if (toothData.status !== 'healthy') {
                acc[toothData.status] = (acc[toothData.status] || 0) + 1;
            }
            return acc;
        }, {} as Record<ToothStatus, number>);

        const summaryEntries = Object.entries(summary);

        if (summaryEntries.length === 0) {
            return (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200">
                    <i className="fas fa-tooth text-success"></i>
                    <p className="text-sm text-slate-600">Excellent oral health.</p>
                </div>
            );
        }

        return (
            <div className="mt-4 pt-4 border-t border-slate-200">
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Chart Summary</h4>
                <div className="flex flex-wrap gap-2 items-center">
                    {summaryEntries.map(([status, count]) => {
                        const config = STATUS_CONFIG[status as ToothStatus];
                        if (!config) return null;
                        return (
                            <div 
                                key={status} 
                                className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full ${config.bg} ${config.text} border ${config.border}`}
                                title={`${count} ${config.label}`}
                            >
                                {config.icon && <i className={`fas ${config.icon}`}></i>}
                                <span>{count}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }, [patient.teethChart]);
    
    return (
        <div className="bg-white rounded-lg shadow-sm p-5 border border-slate-200/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-slideUp hover:border-primary">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg text-slate-800">{patient.name}</h3>
                    <span className="inline-block bg-primary-light text-primary-dark text-xs font-semibold px-2 py-1 rounded-md">{patient.code}</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={callPatient} className="w-8 h-8 flex items-center justify-center text-slate-500 bg-slate-100 rounded-full hover:bg-primary hover:text-white transition-colors">
                        <i className="fas fa-phone"></i>
                    </button>
                    <button onClick={whatsappPatient} className="w-8 h-8 flex items-center justify-center text-slate-500 bg-slate-100 rounded-full hover:bg-green-500 hover:text-white transition-colors">
                        <i className="fab fa-whatsapp"></i>
                    </button>
                </div>
            </div>
            
            <div className="space-y-2 text-sm mt-4">
                 <div className="flex justify-between">
                    <span className="font-medium text-slate-500">First Visit:</span>
                    <span className="text-slate-700">{patient.firstVisit}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="font-medium text-slate-500">Total Visits:</span>
                    <span className="font-semibold text-slate-700">{patient.visits.length}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium text-slate-500">Balance:</span>
                    <span className={`font-semibold px-2 py-0.5 rounded-md text-xs ${patient.balance > 0 ? 'bg-error/10 text-error' : 'bg-success/10 text-success'}`}>{patient.balance.toLocaleString()} IQD</span>
                </div>
            </div>

            {chartSummary}
            
            <button onClick={viewDetails} className="w-full text-center mt-4 px-3 py-2 bg-slate-100 text-slate-600 font-semibold rounded-md hover:bg-slate-200 transition-colors text-sm">
                View Full Details
            </button>
        </div>
    );
};

export default PatientCard;