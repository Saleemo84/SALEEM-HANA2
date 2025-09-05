import React from 'react';
import type { Patient, Appointment } from '../types';
import PatientCard from './PatientCard';
import FinanceChart from './FinanceChart';

interface DashboardProps {
    patients: Patient[];
    appointments: Appointment[];
    onAddPatientClick: () => void;
    onAddAppointmentClick: () => void;
}

const TodaysAppointments: React.FC<{ appointments: Appointment[] }> = ({ appointments }) => {
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(a => a.date === today);

    return (
        <>
            {todayAppointments.length === 0 ? (
                <p className="p-4 text-center text-slate-500">No appointments scheduled for today</p>
            ) : (
                <div className="space-y-2">
                    {todayAppointments.map(app => (
                        <div key={app.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-md transition-colors duration-200 border-b last:border-b-0 border-slate-100">
                            <div>
                                <p className="font-semibold text-slate-800">{app.patientName}</p>
                                <p className="text-sm text-slate-500">{app.time} - {app.procedure}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                app.status === 'completed' ? 'bg-success/20 text-green-700' : 'bg-primary/10 text-primary'
                            }`}>
                                {app.status}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

const UpcomingReminders: React.FC<{ appointments: Appointment[] }> = ({ appointments }) => {
    const upcoming = appointments
        .filter(a => a.status === 'scheduled' && a.reminderDateTime && !a.reminderSent && new Date(a.reminderDateTime) > new Date())
        .sort((a, b) => new Date(a.reminderDateTime!).getTime() - new Date(b.reminderDateTime!).getTime())
        .slice(0, 5); // Show top 5

    if (upcoming.length === 0) {
        return <p className="p-4 text-center text-slate-500">No upcoming reminders.</p>;
    }

    return (
        <div className="space-y-2">
            {upcoming.map(app => (
                <div key={app.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-md transition-colors duration-200 border-b last:border-b-0 border-slate-100">
                    <div>
                        <p className="font-semibold text-slate-800">{app.patientName}</p>
                        <p className="text-sm text-slate-500">Reminder for: {new Date(app.reminderDateTime!).toLocaleString()}</p>
                    </div>
                    <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-1 rounded-full">Pending</span>
                </div>
            ))}
        </div>
    );
};


const Dashboard: React.FC<DashboardProps> = ({ patients, appointments, onAddPatientClick, onAddAppointmentClick }) => {
    const recentPatients = patients.slice(0, 4);
    
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow duration-300">
                    <div className="flex justify-between items-center p-4 border-b border-slate-200">
                        <h2 className="text-lg font-bold text-slate-700">Today's Appointments</h2>
                        <button onClick={onAddAppointmentClick} className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-primary/20 transform hover:-translate-y-0.5">
                            <i className="fas fa-plus"></i> New Appointment
                        </button>
                    </div>
                    <div className="p-4 animate-fadeIn">
                        <TodaysAppointments appointments={appointments} />
                    </div>
                </div>
                 <div className="bg-white rounded-lg shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow duration-300">
                    <div className="flex justify-between items-center p-4 border-b border-slate-200">
                        <h2 className="text-lg font-bold text-slate-700">Recent Patients</h2>
                        <button onClick={onAddPatientClick} className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-primary/20 transform hover:-translate-y-0.5">
                            <i className="fas fa-plus"></i> Add Patient
                        </button>
                    </div>
                     <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                        {recentPatients.map(patient => (
                           <div key={patient.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200 hover:border-primary transition-colors">
                                <p className="font-semibold text-slate-800">{patient.name}</p>
                                <p className="text-sm text-slate-500">{patient.phone}</p>
                                <p className={`text-sm font-medium ${patient.balance > 0 ? 'text-error' : 'text-success'}`}>
                                    Balance: {patient.balance.toLocaleString()} IQD
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
             <div className="bg-white rounded-lg shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow duration-300 animate-fadeIn">
                <div className="flex justify-between items-center p-4 border-b border-slate-200">
                    <h2 className="text-lg font-bold text-slate-700">Upcoming Reminders</h2>
                    <i className="fas fa-bell text-primary"></i>
                </div>
                <div className="p-4">
                    <UpcomingReminders appointments={appointments} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;