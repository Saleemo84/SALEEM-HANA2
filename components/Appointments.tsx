import React from 'react';
import type { Appointment } from '../types';

interface AppointmentsProps {
    appointments: Appointment[];
    onEdit: (appointment: Appointment) => void;
}

const Appointments: React.FC<AppointmentsProps> = ({ appointments, onEdit }) => {
    const sortedAppointments = [...appointments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200/80 p-4 md:p-6 animate-fadeIn">
            <div className="border-b border-slate-200 pb-4 mb-6">
                <h2 className="text-xl font-bold text-slate-800">All Appointments</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                        <tr>
                            <th scope="col" className="px-6 py-3">Patient</th>
                            <th scope="col" className="px-6 py-3">Date & Time</th>
                            <th scope="col" className="px-6 py-3">Procedure</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-center">Reminder</th>
                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedAppointments.map((app) => (
                            <tr key={app.id} className="bg-white hover:bg-slate-50 border-b border-slate-200">
                                <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{app.patientName}</th>
                                <td className="px-6 py-4">{app.date} at {app.time}</td>
                                <td className="px-6 py-4">{app.procedure}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                                        app.status === 'completed' ? 'bg-success/20 text-green-700' :
                                        app.status === 'cancelled' ? 'bg-error/20 text-error' :
                                        'bg-sky-100 text-sky-700'
                                    }`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {app.reminderDateTime ? (
                                        app.reminderSent ? (
                                            <span className="text-success" title="Reminder sent"><i className="fas fa-check-circle"></i></span>
                                        ) : (
                                            <span className="text-amber-500" title="Reminder pending"><i className="fas fa-clock"></i></span>
                                        )
                                    ) : (
                                        <span className="text-slate-400" title="No reminder set"><i className="fas fa-minus-circle"></i></span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={() => onEdit(app)}
                                        className="font-medium text-primary hover:text-primary-dark transition-colors"
                                        title="Edit Appointment"
                                    >
                                        <i className="fas fa-pencil-alt"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {sortedAppointments.length === 0 && (
                    <p className="text-center text-slate-500 py-8">No appointments found.</p>
                )}
            </div>
        </div>
    );
};

export default Appointments;