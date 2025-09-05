import React, { useState } from 'react';
import Modal from './Modal';
import type { Patient, LabOrder } from '../types';

type NewLabOrderData = Omit<LabOrder, 'id' | 'patientName' | 'creationDate' | 'paymentStatus'>;

interface AddLabOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    patients: Patient[];
    onAddLabOrder: (order: NewLabOrderData) => void;
}

const AddLabOrderModal: React.FC<AddLabOrderModalProps> = ({ isOpen, onClose, patients, onAddLabOrder }) => {
    const [patientId, setPatientId] = useState<number | ''>('');
    const [labName, setLabName] = useState('');
    const [shade, setShade] = useState('');
    const [workType, setWorkType] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [cost, setCost] = useState<number>(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!patientId || !labName || !workType || !deliveryDate) {
            alert('Please fill in all required fields.');
            return;
        }
        onAddLabOrder({
            patientId: Number(patientId),
            labName,
            shade,
            workType,
            deliveryDate,
            cost,
        });
        // Reset form
        setPatientId('');
        setLabName('');
        setShade('');
        setWorkType('');
        setDeliveryDate('');
        setCost(0);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Lab Order">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="patientSelect" className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                    <select
                        id="patientSelect"
                        value={patientId}
                        onChange={(e) => setPatientId(Number(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        required
                    >
                        <option value="" disabled>Select a patient</option>
                        {patients.map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="labName" className="block text-sm font-medium text-gray-700 mb-1">Lab Name</label>
                        <input type="text" id="labName" value={labName} onChange={(e) => setLabName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" placeholder="e.g., Premium Dental Lab" required/>
                    </div>
                    <div>
                        <label htmlFor="workType" className="block text-sm font-medium text-gray-700 mb-1">Type of Work</label>
                        <input type="text" id="workType" value={workType} onChange={(e) => setWorkType(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" placeholder="e.g., Zirconia Crown" required/>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="shade" className="block text-sm font-medium text-gray-700 mb-1">Shade</label>
                        <input type="text" id="shade" value={shade} onChange={(e) => setShade(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" placeholder="e.g., A2"/>
                    </div>
                    <div>
                        <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700 mb-1">Expected Delivery Date</label>
                        <input type="date" id="deliveryDate" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" required/>
                    </div>
                </div>

                <div>
                    <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1">Cost (IQD)</label>
                    <input type="number" id="cost" value={cost} onChange={(e) => setCost(Number(e.target.value))} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" min="0" step="1000" />
                </div>
                
                <button type="submit" className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-sm">
                    <i className="fas fa-save"></i> Save Lab Order
                </button>
            </form>
        </Modal>
    );
};

export default AddLabOrderModal;
