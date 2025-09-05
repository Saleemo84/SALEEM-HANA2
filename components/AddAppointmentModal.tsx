import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import type { Patient, Appointment, AppointmentFormData } from '../types';

interface AddAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    patients: Patient[];
    onSaveAppointment: (appointment: AppointmentFormData) => void;
    appointmentToEdit: Appointment | null;
}

const AddAppointmentModal: React.FC<AddAppointmentModalProps> = ({ isOpen, onClose, patients, onSaveAppointment, appointmentToEdit }) => {
    const [patientId, setPatientId] = useState<number | ''>('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState('10:00');
    const [procedure, setProcedure] = useState('');
    const [sendReminder, setSendReminder] = useState(true);
    const [status, setStatus] = useState<'scheduled' | 'completed' | 'cancelled'>('scheduled');

    const isEditing = appointmentToEdit !== null;

    useEffect(() => {
        if (isEditing && isOpen) {
            setPatientId(appointmentToEdit.patientId);
            setDate(appointmentToEdit.date);
            setTime(appointmentToEdit.time);
            setProcedure(appointmentToEdit.procedure);
            setStatus(appointmentToEdit.status);
            setSendReminder(!!appointmentToEdit.reminderDateTime);
        } else if (!isOpen) {
            // Reset form when modal is closed, ensuring it's fresh for the next open
            setPatientId('');
            setDate(new Date().toISOString().split('T')[0]);
            setTime('10:00');
            setProcedure('');
            setStatus('scheduled');
            setSendReminder(true);
        }
    }, [appointmentToEdit, isOpen, isEditing]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!patientId || !date || !time || !procedure) {
            alert('Please fill in all fields.');
            return;
        }
        onSaveAppointment({ 
            id: isEditing ? appointmentToEdit.id : undefined,
            patientId: Number(patientId), 
            date, 
            time, 
            procedure, 
            sendReminder,
            status,
        });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Edit Appointment" : "Schedule New Appointment"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="patientSelectApp" className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                    <select
                        id="patientSelectApp"
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
                        <label htmlFor="appDate" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input type="date" id="appDate" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" required />
                    </div>
                    <div>
                        <label htmlFor="appTime" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                        <input type="time" id="appTime" value={time} onChange={(e) => setTime(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" required />
                    </div>
                </div>
                <div>
                    <label htmlFor="appProcedure" className="block text-sm font-medium text-gray-700 mb-1">Procedure</label>
                    <input type="text" id="appProcedure" value={procedure} onChange={(e) => setProcedure(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" placeholder="e.g., Checkup, Filling" required />
                </div>
                {isEditing && (
                     <div>
                        <label htmlFor="appStatus" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select id="appStatus" value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary">
                            <option value="scheduled">Scheduled</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                )}
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-md border border-slate-200">
                    <input
                        type="checkbox"
                        id="sendReminder"
                        checked={sendReminder}
                        onChange={(e) => setSendReminder(e.target.checked)}
                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <div>
                        <label htmlFor="sendReminder" className="font-medium text-gray-800">Automated Reminder</label>
                        <p className="text-xs text-slate-500">A reminder will be sent to the patient 24 hours before the appointment.</p>
                    </div>
                </div>
                <button type="submit" className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-sm">
                    <i className={isEditing ? "fas fa-save" : "fas fa-calendar-check"}></i> {isEditing ? "Save Changes" : "Schedule Appointment"}
                </button>
            </form>
        </Modal>
    );
};

export default AddAppointmentModal;