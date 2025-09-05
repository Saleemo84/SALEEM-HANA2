import React, { useState, useMemo } from 'react';
import type { Patient, ToothData } from '../types';
import { generateDefaultTeethChart } from '../constants';
import ToothNoteModal from './ToothNoteModal';
import ToothIcon from './ToothIcon';

interface TeethChartProps {
    patients: Patient[];
    updatePatientTeethChart: (patientId: number, toothId: string, updates: Partial<ToothData>) => void;
}

const TeethChart: React.FC<TeethChartProps> = ({ patients, updatePatientTeethChart }) => {
    const [selectedPatientId, setSelectedPatientId] = useState<number | null>(patients.length > 0 ? patients[0].id : null);
    const [editingTooth, setEditingTooth] = useState<{ toothId: string, data: ToothData } | null>(null);

    const selectedPatient = useMemo(() => {
        return patients.find(p => p.id === selectedPatientId);
    }, [patients, selectedPatientId]);

    const handleToothClick = (toothId: string) => {
        if (!selectedPatient) return;
        
        const patientTeethChart = selectedPatient.teethChart || generateDefaultTeethChart();
        const currentToothData = patientTeethChart[toothId] || { status: 'healthy', note: '' };
        
        setEditingTooth({ toothId, data: currentToothData });
    };

    const handleSaveToothData = (toothId: string, data: ToothData) => {
        if (selectedPatientId) {
            updatePatientTeethChart(selectedPatientId, toothId, data);
        }
        setEditingTooth(null);
    };

    const handleCloseModal = () => {
        setEditingTooth(null);
    };

    const teethLayout = {
        upperRight: [8, 7, 6, 5, 4, 3, 2, 1],
        upperLeft: [9, 10, 11, 12, 13, 14, 15, 16],
        lowerRight: [32, 31, 30, 29, 28, 27, 26, 25],
        lowerLeft: [24, 23, 22, 21, 20, 19, 18, 17],
    };

    const patientTeethChart = selectedPatient?.teethChart || generateDefaultTeethChart();

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm border border-slate-200/80 p-4 md:p-6 animate-fadeIn space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-4 gap-4">
                    <h2 className="text-xl font-semibold text-slate-800">Teeth Chart</h2>
                    {patients.length > 0 ? (
                        <div className="w-full md:w-72">
                            <select
                                value={selectedPatientId ?? ''}
                                onChange={(e) => setSelectedPatientId(Number(e.target.value))}
                                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary transition"
                                aria-label="Select a patient"
                            >
                                {patients.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                                ))}
                            </select>
                        </div>
                    ) : <p className="text-sm text-slate-500">No patients available.</p>
                    }
                </div>

                {selectedPatient ? (
                    <>
                        <div className="p-4 bg-slate-50 rounded-lg overflow-x-auto">
                            <p className="text-center text-slate-600 mb-4 font-medium">Click on a tooth to edit its status and add notes.</p>
                            <div className="inline-block min-w-full text-center">
                                {/* UPPER JAW */}
                                <div className="flex justify-center items-end mb-2">
                                    <div className="flex gap-1">{teethLayout.upperRight.map(id => <ToothIcon key={id} id={id.toString()} toothData={patientTeethChart[id.toString()] || {status: 'healthy', note: ''}} onClick={handleToothClick} position="upper" />)}</div>
                                    <div className="w-px h-12 bg-slate-300 mx-1 md:mx-2 self-center"></div>
                                    <div className="flex gap-1">{teethLayout.upperLeft.map(id => <ToothIcon key={id} id={id.toString()} toothData={patientTeethChart[id.toString()] || {status: 'healthy', note: ''}} onClick={handleToothClick} position="upper" />)}</div>
                                </div>
                                {/* LOWER JAW */}
                                <div className="flex justify-center items-start">
                                    <div className="flex gap-1">{teethLayout.lowerRight.map(id => <ToothIcon key={id} id={id.toString()} toothData={patientTeethChart[id.toString()] || {status: 'healthy', note: ''}} onClick={handleToothClick} position="lower" />)}</div>
                                    <div className="w-px h-12 bg-slate-300 mx-1 md:mx-2 self-center"></div>
                                    <div className="flex gap-1">{teethLayout.lowerLeft.map(id => <ToothIcon key={id} id={id.toString()} toothData={patientTeethChart[id.toString()] || {status: 'healthy', note: ''}} onClick={handleToothClick} position="lower" />)}</div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <p className="text-center text-slate-500 py-8">Select a patient to view their teeth chart.</p>
                )}
            </div>
            <ToothNoteModal
                editingTooth={editingTooth}
                onClose={handleCloseModal}
                onSave={handleSaveToothData}
            />
        </>
    );
};

export default TeethChart;