
import React from 'react';
import type { Patient, Appointment } from '../types';
import PatientCard from './PatientCard';
import FinanceChart from './FinanceChart';

interface DashboardProps {
    patients: Patient[];
    appointments: Appointment[];
    onAddPatientClick: () => void;
}

const TodaysAppointments: React.FC<{ appointments: Appointment[] }> = ({ appointments }) => {
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(a => a.date === today);

    return (
        <>
            {todayAppointments.length === 0 ? (
                <p className="p-4 text-center text-gray-500">No appointments scheduled for today</p>
            ) : (
                <div className="space-y-2">
                    {todayAppointments.map(app => (
                        <div key={app.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-md transition-colors duration-200 border-b last:border-b-0">
                            <div>
                                <p className="font-semibold text-gray-800">{app.patientName}</p>
                                <p className="text-sm text-gray-500">{app.time} - {app.procedure}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                app.status === 'completed' ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary'
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


const Dashboard: React.FC<DashboardProps> = ({ patients, appointments, onAddPatientClick }) => {
    const recentPatients = patients.slice(0, 4);
    
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 animate-fadeIn">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                        <h2 className="text-xl font-semibold text-primary">Today's Appointments</h2>
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-sm">
                            <i className="fas fa-plus"></i> New Appointment
                        </button>
                    </div>
                    <TodaysAppointments appointments={appointments} />
                </div>
                 <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 animate-fadeIn">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                        <h2 className="text-xl font-semibold text-primary">Recent Patients</h2>
                        <button onClick={onAddPatientClick} className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-sm">
                            <i className="fas fa-plus"></i> Add Patient
                        </button>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recentPatients.map(patient => (
                           <div key={patient.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <p className="font-semibold text-gray-800">{patient.name}</p>
                                <p className="text-sm text-gray-500">{patient.phone}</p>
                                <p className={`text-sm font-medium ${patient.balance > 0 ? 'text-error' : 'text-success'}`}>
                                    Balance: {patient.balance.toLocaleString()} IQD
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 animate-fadeIn">
                <div className="border-b border-gray-200 pb-4 mb-4">
                    <h2 className="text-xl font-semibold text-primary">Income vs Expenditure</h2>
                </div>
                <FinanceChart />
            </div>
        </div>
    );
};

export default Dashboard;
