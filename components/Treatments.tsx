import React, { useState, useMemo } from 'react';
import type { Patient, Treatment } from '../types';
import Modal from './Modal';

interface TreatmentsProps {
    patients: Patient[];
    updateTreatment: (patientId: number, treatmentId: string, updates: Partial<Treatment>) => void;
    deleteTreatment: (patientId: number, treatmentId: string) => void;
    showToast: (message: string, type?: 'success' | 'error') => void;
}

const Treatments: React.FC<TreatmentsProps> = ({ patients, updateTreatment, deleteTreatment, showToast }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [editingTreatmentId, setEditingTreatmentId] = useState<string | null>(null);
    const [currentPrice, setCurrentPrice] = useState<number>(0);
    const [currentNotes, setCurrentNotes] = useState<string>('');
    const [treatmentToDelete, setTreatmentToDelete] = useState<{ patientId: number; treatmentId: string; procedure: string; patientName: string; } | null>(null);


    const allTreatments = useMemo(() => {
        return patients
            .flatMap(patient =>
                (patient.treatments || []).map(treatment => ({
                    ...treatment,
                    patientName: patient.name,
                    patientId: patient.id,
                }))
            )
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [patients]);

    const filteredTreatments = useMemo(() => {
        if (!searchTerm) return allTreatments;
        const lowercasedTerm = searchTerm.toLowerCase();
        return allTreatments.filter(
            (treatment) =>
                treatment.patientName.toLowerCase().includes(lowercasedTerm) ||
                treatment.procedure.toLowerCase().includes(lowercasedTerm)
        );
    }, [allTreatments, searchTerm]);

    const handleEditClick = (treatment: { id: string; cost: number; notes?: string }) => {
        setEditingTreatmentId(treatment.id);
        setCurrentPrice(treatment.cost);
        setCurrentNotes(treatment.notes || '');
    };

    const handleCancelClick = () => {
        setEditingTreatmentId(null);
    };

    const handleSaveClick = (patientId: number, treatmentId: string) => {
        updateTreatment(patientId, treatmentId, { cost: currentPrice, notes: currentNotes });
        setEditingTreatmentId(null);
        showToast('Treatment updated successfully!');
    };
    
    const handleDeleteClick = (treatment: { patientId: number; id: string; procedure: string; patientName: string; }) => {
        setTreatmentToDelete({
            patientId: treatment.patientId,
            treatmentId: treatment.id,
            procedure: treatment.procedure,
            patientName: treatment.patientName
        });
    };

    const handleConfirmDelete = () => {
        if (treatmentToDelete) {
            deleteTreatment(treatmentToDelete.patientId, treatmentToDelete.treatmentId);
            showToast('Treatment deleted successfully!');
            setTreatmentToDelete(null);
        }
    };


    const handleExportTreatments = () => {
        if (allTreatments.length === 0) {
            showToast('No treatments to export.', 'error');
            return;
        }
    
        const headers = [
            "Patient Name",
            "Date",
            "Procedure",
            "Notes",
            "Cost (IQD)"
        ];
    
        const treatmentData = allTreatments.map(t => {
            const patientName = `"${t.patientName.replace(/"/g, '""')}"`;
            const date = t.date;
            const procedure = `"${t.procedure.replace(/"/g, '""')}"`;
            const notes = `"${(t.notes || '').replace(/"/g, '""')}"`;
            const cost = t.cost;
            return [patientName, date, procedure, notes, cost].join(',');
        });
    
        const csvContent = [
            headers.join(','),
            ...treatmentData
        ].join('\n');
    
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `treatments_export_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast('All treatments exported successfully!');
        }
    };

    return (
        <>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200/80 p-4 md:p-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-4 mb-6 gap-4">
                <h2 className="text-xl font-bold text-slate-800">Treatments History</h2>
                <div className="relative w-full md:w-72">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search patient or procedure..."
                        className="w-full pl-4 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary transition"
                    />
                    <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
                 <button onClick={handleExportTreatments} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-all duration-300 shadow-sm hover:shadow-lg transform hover:-translate-y-0.5">
                    <i className="fas fa-file-excel"></i> Export All
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                        <tr>
                            <th scope="col" className="px-6 py-3">Patient</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Procedure</th>
                            <th scope="col" className="px-6 py-3">Notes</th>
                            <th scope="col" className="px-6 py-3">Cost (IQD)</th>
                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTreatments.map((treatment) => (
                            <tr key={treatment.id} className={`border-b border-slate-200 transition-colors duration-200 ${editingTreatmentId === treatment.id ? 'bg-primary-light' : 'bg-white hover:bg-slate-50'}`}>
                                <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                                    {treatment.patientName}
                                </th>
                                <td className="px-6 py-4">{treatment.date}</td>
                                <td className="px-6 py-4">{treatment.procedure}</td>
                                <td className="px-6 py-4 max-w-sm">
                                     {editingTreatmentId === treatment.id ? (
                                        <textarea
                                            value={currentNotes}
                                            onChange={(e) => setCurrentNotes(e.target.value)}
                                            className="w-full p-2 border border-primary rounded-md focus:ring-primary focus:border-primary text-sm"
                                            rows={2}
                                            placeholder="Add notes..."
                                        />
                                    ) : (
                                        <p className="truncate" title={treatment.notes}>{treatment.notes || '-'}</p>
                                    )}
                                </td>
                                <td className="px-6 py-4 font-semibold text-slate-800">
                                    {editingTreatmentId === treatment.id ? (
                                        <input
                                            type="number"
                                            value={currentPrice}
                                            onChange={(e) => setCurrentPrice(Number(e.target.value))}
                                            className="w-32 p-1 border border-primary rounded-md focus:ring-primary focus:border-primary"
                                            autoFocus
                                        />
                                    ) : (
                                        treatment.cost.toLocaleString()
                                    )}
                                </td>
                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                    {editingTreatmentId === treatment.id ? (
                                        <div className="flex gap-2 justify-center">
                                            <button onClick={() => handleSaveClick(treatment.patientId, treatment.id)} className="flex items-center gap-1 font-medium text-success hover:underline"><i className="fas fa-check"></i> Save</button>
                                            <button onClick={handleCancelClick} className="flex items-center gap-1 font-medium text-slate-500 hover:underline"><i className="fas fa-times"></i> Cancel</button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-4 justify-center">
                                            <button onClick={() => handleEditClick(treatment)} className="font-medium text-primary hover:text-primary-dark transition-colors" title="Edit">
                                                <i className="fas fa-pencil-alt"></i>
                                            </button>
                                            <button onClick={() => handleDeleteClick(treatment)} className="font-medium text-error hover:text-red-700 transition-colors" title="Delete">
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredTreatments.length === 0 && (
                    <p className="text-center text-slate-500 py-8">No treatments found.</p>
                )}
            </div>
        </div>
        <Modal isOpen={!!treatmentToDelete} onClose={() => setTreatmentToDelete(null)} title="Confirm Deletion">
            {treatmentToDelete && (
                 <div className="space-y-4">
                    <p className="text-slate-600">
                        Are you sure you want to permanently delete the treatment <strong className="text-slate-800">{treatmentToDelete.procedure}</strong> for patient <strong className="text-slate-800">{treatmentToDelete.patientName}</strong>?
                    </p>
                    <p className="text-sm font-medium text-error bg-red-50 p-3 rounded-md">
                        <i className="fas fa-exclamation-triangle mr-2"></i>This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-4 pt-4">
                        <button onClick={() => setTreatmentToDelete(null)} className="px-6 py-2 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300">
                            Cancel
                        </button>
                        <button onClick={handleConfirmDelete} className="px-6 py-2 bg-error text-white font-semibold rounded-lg hover:bg-red-700">
                            Confirm Delete
                        </button>
                    </div>
                </div>
            )}
        </Modal>
        </>
    );
};

export default Treatments;