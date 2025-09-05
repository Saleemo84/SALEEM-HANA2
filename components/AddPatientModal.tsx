
import React, { useState } from 'react';
import Modal from './Modal';
import type { Patient } from '../types';

interface AddPatientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddPatient: (patient: Omit<Patient, 'id' | 'code' | 'lastVisit'>) => void;
}

const AddPatientModal: React.FC<AddPatientModalProps> = ({ isOpen, onClose, onAddPatient }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [medicalConditions, setMedicalConditions] = useState('');
    const [nextAppointment, setNextAppointment] = useState('');
    const [balance, setBalance] = useState(0);
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !phone) {
            alert('Please fill in at least the name and phone number.');
            return;
        }
        onAddPatient({ name, phone, medicalConditions, nextAppointment, balance, notes });
        // Reset form
        setName('');
        setPhone('');
        setMedicalConditions('');
        setNextAppointment('');
        setBalance(0);
        setNotes('');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Patient">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input type="text" id="patientName" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" placeholder="Enter patient's full name" required/>
                    </div>
                    <div>
                        <label htmlFor="patientPhone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input type="tel" id="patientPhone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" placeholder="Enter phone number" required/>
                    </div>
                </div>
                <div>
                    <label htmlFor="patientDiseases" className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions</label>
                    <textarea id="patientDiseases" value={medicalConditions} onChange={(e) => setMedicalConditions(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" rows={3} placeholder="List any medical conditions or allergies"></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="followUpDate" className="block text-sm font-medium text-gray-700 mb-1">Next Follow-up Date</label>
                        <input type="date" id="followUpDate" value={nextAppointment} onChange={(e) => setNextAppointment(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"/>
                    </div>
                    <div>
                        <label htmlFor="paymentDue" className="block text-sm font-medium text-gray-700 mb-1">Payment Due (IQD)</label>
                        <input type="number" id="paymentDue" value={balance} onChange={(e) => setBalance(Number(e.target.value))} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" min="0" step="1000" />
                    </div>
                </div>
                <div>
                    <label htmlFor="patientNotes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea id="patientNotes" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" rows={3} placeholder="Additional notes"></textarea>
                </div>
                <button type="submit" className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-sm">
                    <i className="fas fa-save"></i> Save Patient
                </button>
            </form>
        </Modal>
    );
};

export default AddPatientModal;
