import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import type { ToothData, ToothStatus } from '../types';
import { STATUS_CONFIG } from '../constants';

interface ToothNoteModalProps {
    editingTooth: { toothId: string; data: ToothData } | null;
    onClose: () => void;
    onSave: (toothId: string, data: ToothData) => void;
}

const ToothNoteModal: React.FC<ToothNoteModalProps> = ({ editingTooth, onClose, onSave }) => {
    const [note, setNote] = useState('');
    const [status, setStatus] = useState<ToothStatus>('healthy');

    useEffect(() => {
        if (editingTooth) {
            setNote(editingTooth.data.note);
            setStatus(editingTooth.data.status);
        }
    }, [editingTooth]);

    if (!editingTooth) {
        return null;
    }

    const { toothId } = editingTooth;

    const handleSave = () => {
        onSave(toothId, { status, note });
    };

    // Dynamically set classes for the dropdown based on the selected status for better visual feedback
    const selectedStatusConfig = STATUS_CONFIG[status] || STATUS_CONFIG['healthy'];
    const selectClasses = `w-full p-2 border rounded-md focus:ring-primary focus:border-primary transition-colors duration-200 ${selectedStatusConfig.bg} ${selectedStatusConfig.text} ${selectedStatusConfig.border}`;

    return (
        <Modal isOpen={!!editingTooth} onClose={onClose} title={`Edit Tooth #${toothId}`}>
            <div className="space-y-4">
                <div>
                    <label htmlFor="toothStatus" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                        id="toothStatus"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as ToothStatus)}
                        className={selectClasses}
                    >
                        {Object.entries(STATUS_CONFIG).map(([statusKey, config]) => (
                            <option
                              key={statusKey}
                              value={statusKey}
                              className="bg-white text-gray-800"
                            >
                                {config.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="toothNote" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                        id="toothNote"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        rows={6}
                        placeholder="Enter notes for this tooth..."
                        aria-label={`Notes for tooth ${toothId}`}
                    />
                </div>
                <button
                    onClick={handleSave}
                    className="w-full mt-4 flex justify-center items-center gap-2 px-4 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-sm"
                >
                    <i className="fas fa-save"></i> Save Changes
                </button>
            </div>
        </Modal>
    );
};

export default ToothNoteModal;
