
import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Patients from './components/Patients';
import Treatments from './components/Treatments';
import Finance from './components/Finance';
import TeethChart from './components/TeethChart';
import Lab from './components/Lab';
import AddPatientModal from './components/AddPatientModal';
import AddLabOrderModal from './components/AddLabOrderModal';
import AddExpenseModal from './components/AddExpenseModal';
import ScannerModal from './components/ScannerModal';
import Toast from './components/Toast';
import OutlookSync from './components/OutlookSync';
import Backup from './components/Backup';
import Appointments from './components/Appointments';
import AddAppointmentModal from './components/AddAppointmentModal';
import Settings from './components/Settings';
import { useClinicData } from './hooks/useClinicData';
// FIX: Removed unused import for LOGO_BASE64 which does not exist in constants.ts.
import type { Patient, LabOrder, ExpenditureItem, NewAppointmentData, Appointment, AppointmentFormData } from './types';

type Tab = 'dashboard' | 'patients' | 'appointments' | 'finance' | 'treatments' | 'teeth-chart' | 'lab' | 'outlook' | 'backup' | 'settings';

type NewPatientData = {
    name: string;
    phone: string;
    medicalConditions: string;
    nextAppointment: string;
    balance: number;
    notes: string;
    firstVisit: string;
};
type NewLabOrderData = Omit<LabOrder, 'id' | 'patientName' | 'creationDate' | 'paymentStatus'>;
type NewExpenditureData = Omit<ExpenditureItem, 'id'>;

const dailyGradients = [
    'from-violet-100 to-fuchsia-100', 'from-sky-100 to-cyan-100', 'from-emerald-100 to-lime-100',
    'from-amber-100 to-orange-100', 'from-rose-100 to-pink-100', 'from-indigo-100 to-purple-100',
    'from-teal-100 to-cyan-100',
];

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');
    const { 
        patients, 
        appointments, 
        financials,
        labOrders,
        clinicInfo,
        addPatient, 
        updatePatient, 
        updatePatientTeethChart,
        updateTreatment,
        deleteTreatment,
        addLabOrder,
        updateLabOrderStatus,
        addExpenditure,
        addAppointment,
        updateAppointment,
        markReminderAsSent,
        outlookAccounts,
        addOutlookAccount,
        removeOutlookAccount,
        googleAccounts,
        addGoogleAccount,
        removeGoogleAccount,
        updateClinicInfo,
    } = useClinicData();

    const [isAddPatientModalOpen, setAddPatientModalOpen] = useState(false);
    const [isAddAppointmentModalOpen, setAddAppointmentModalOpen] = useState(false);
    const [isAddLabOrderModalOpen, setAddLabOrderModalOpen] = useState(false);
    const [isAddExpenseModalOpen, setAddExpenseModalOpen] = useState(false);
    const [isScannerModalOpen, setScannerModalOpen] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [appointmentToEdit, setAppointmentToEdit] = useState<Appointment | null>(null);


    useEffect(() => {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 0);
        const diff = now.getTime() - startOfYear.getTime();
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        
        const dailyGradient = `bg-gradient-to-br ${dailyGradients[dayOfYear % dailyGradients.length]}`;
        
        document.body.className = 'bg-slate-50 font-sans'; // Reset
        document.body.classList.add(...dailyGradient.split(' '));
    }, []);


    const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    useEffect(() => {
        const reminderInterval = setInterval(() => {
            const now = new Date();
            appointments.forEach(app => {
                if (
                    app.status === 'scheduled' &&
                    !app.reminderSent &&
                    app.reminderDateTime &&
                    now >= new Date(app.reminderDateTime)
                ) {
                    showToast(`Reminder: ${app.patientName}'s appointment for ${app.procedure} is within 24 hours.`);
                    markReminderAsSent(app.id);
                }
            });
        }, 30000); // Check every 30 seconds

        return () => clearInterval(reminderInterval);
    }, [appointments, showToast, markReminderAsSent]);

    const handleAddPatient = (patient: NewPatientData) => {
        addPatient(patient);
        setAddPatientModalOpen(false);
        showToast(`Patient ${patient.name} added successfully!`);
    };

    const openAddAppointmentModal = () => {
        setAppointmentToEdit(null);
        setAddAppointmentModalOpen(true);
    };

    const closeAddAppointmentModal = () => {
        setAppointmentToEdit(null);
        setAddAppointmentModalOpen(false);
    };

    const handleEditAppointment = (appointment: Appointment) => {
        setAppointmentToEdit(appointment);
        setAddAppointmentModalOpen(true);
    };

    const handleAddLabOrder = (order: NewLabOrderData) => {
        addLabOrder(order);
        setAddLabOrderModalOpen(false);
        showToast('Lab order added successfully!');
    };

    const handleAddExpense = (expense: NewExpenditureData) => {
        addExpenditure(expense);
        setAddExpenseModalOpen(false);
        showToast('Expense added successfully!');
    };
    
    const handleScanSuccess = (scannedPatient: Patient) => {
        updatePatient(scannedPatient);
        setScannerModalOpen(false);
        showToast(`Patient data for ${scannedPatient.name} restored successfully!`);
    };

    // FIX: Correctly call `updateAppointment` with all required properties and handle both create/update cases.
    const handleSaveAppointment = (appointmentData: AppointmentFormData) => {
        const patientName = patients.find(p => p.id === appointmentData.patientId)?.name || 'a patient';
        if (appointmentData.id) {
            updateAppointment({
                id: appointmentData.id,
                patientId: appointmentData.patientId,
                date: appointmentData.date,
                time: appointmentData.time,
                procedure: appointmentData.procedure,
                sendReminder: appointmentData.sendReminder,
                status: appointmentData.status || 'scheduled',
            });
            showToast(`Appointment for ${patientName} updated successfully!`);
        } else {
            addAppointment({
                patientId: appointmentData.patientId,
                date: appointmentData.date,
                time: appointmentData.time,
                procedure: appointmentData.procedure,
                sendReminder: appointmentData.sendReminder,
            });
            showToast(`Appointment for ${patientName} scheduled successfully!`);
        }
        setAddAppointmentModalOpen(false);
        setAppointmentToEdit(null);
    };

    // FIX: Added a return statement with the main JSX structure for the application, resolving the error that a React component must return a renderable value.
    return (
        <div className="flex flex-col lg:flex-row h-screen bg-slate-50">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                <Header />
                <div className="animate-fadeIn">
                    {activeTab === 'dashboard' && <Dashboard patients={patients} appointments={appointments} onAddPatientClick={() => setAddPatientModalOpen(true)} onAddAppointmentClick={openAddAppointmentModal} />}
                    {activeTab === 'patients' && <Patients patients={patients} onAddPatientClick={() => setAddPatientModalOpen(true)} onScanCardClick={() => setScannerModalOpen(true)} showToast={showToast} />}
                    {activeTab === 'appointments' && <Appointments appointments={appointments} onEdit={handleEditAppointment} />}
                    {activeTab === 'finance' && <Finance financials={financials} patients={patients} onAddExpenseClick={() => setAddExpenseModalOpen(true)} clinicInfo={clinicInfo} />}
                    {activeTab === 'treatments' && <Treatments patients={patients} updateTreatment={updateTreatment} deleteTreatment={deleteTreatment} showToast={showToast} />}
                    {activeTab === 'teeth-chart' && <TeethChart patients={patients} updatePatientTeethChart={updatePatientTeethChart} />}
                    {activeTab === 'lab' && <Lab patients={patients} labOrders={labOrders} updateLabOrderStatus={updateLabOrderStatus} onAddLabOrderClick={() => setAddLabOrderModalOpen(true)} clinicInfo={clinicInfo} />}
                    {activeTab === 'outlook' && <OutlookSync accounts={outlookAccounts} onAddAccount={addOutlookAccount} onRemoveAccount={removeOutlookAccount} showToast={showToast} />}
                    {activeTab === 'backup' && <Backup accounts={googleAccounts} onAddAccount={addGoogleAccount} onRemoveAccount={removeGoogleAccount} showToast={showToast} />}
                    {activeTab === 'settings' && <Settings clinicInfo={clinicInfo} updateClinicInfo={updateClinicInfo} showToast={showToast} />}
                </div>
            </main>
            {isAddPatientModalOpen && <AddPatientModal isOpen={isAddPatientModalOpen} onClose={() => setAddPatientModalOpen(false)} onAddPatient={handleAddPatient} />}
            {isAddAppointmentModalOpen && <AddAppointmentModal isOpen={isAddAppointmentModalOpen} onClose={closeAddAppointmentModal} patients={patients} onSaveAppointment={handleSaveAppointment} appointmentToEdit={appointmentToEdit} />}
            {isAddLabOrderModalOpen && <AddLabOrderModal isOpen={isAddLabOrderModalOpen} onClose={() => setAddLabOrderModalOpen(false)} patients={patients} onAddLabOrder={handleAddLabOrder} />}
            {isAddExpenseModalOpen && <AddExpenseModal isOpen={isAddExpenseModalOpen} onClose={() => setAddExpenseModalOpen(false)} onAddExpense={handleAddExpense} />}
            {isScannerModalOpen && <ScannerModal isOpen={isScannerModalOpen} onClose={() => setScannerModalOpen(false)} onScanSuccess={handleScanSuccess} showToast={showToast} />}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

// FIX: Add default export to resolve import error in index.tsx.
export default App;