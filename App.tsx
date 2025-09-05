
import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Patients from './components/Patients';
import AddPatientModal from './components/AddPatientModal';
import ScannerModal from './components/ScannerModal';
import Toast from './components/Toast';
import { useClinicData } from './hooks/useClinicData';
import type { Patient } from './types';

type Tab = 'dashboard' | 'patients' | 'appointments' | 'finance' | 'treatments' | 'teeth-chart' | 'outlook' | 'backup';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');
    const { patients, appointments, financials, addPatient, updatePatient } = useClinicData();

    const [isAddPatientModalOpen, setAddPatientModalOpen] = useState(false);
    const [isScannerModalOpen, setScannerModalOpen] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    const handleAddPatient = (patient: Omit<Patient, 'id' | 'code' | 'lastVisit'>) => {
        addPatient(patient);
        setAddPatientModalOpen(false);
        showToast(`Patient ${patient.name} added successfully!`);
    };

    const handleScannedPatient = (scannedPatient: Patient) => {
        updatePatient(scannedPatient);
        setScannerModalOpen(false);
        showToast(`Patient ${scannedPatient.name}'s data restored successfully!`);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard 
                            appointments={appointments} 
                            patients={patients}
                            onAddPatientClick={() => setAddPatientModalOpen(true)} />;
            case 'patients':
                return <Patients 
                            patients={patients}
                            onAddPatientClick={() => setAddPatientModalOpen(true)}
                            onScanCardClick={() => setScannerModalOpen(true)}
                            showToast={showToast}
                        />;
            default:
                return (
                    <div className="bg-white rounded-lg shadow-sm p-6 animate-fadeIn">
                        <div className="border-b border-gray-200 pb-4 mb-4">
                            <h2 className="text-xl font-semibold text-primary capitalize">{activeTab.replace('-', ' ')}</h2>
                        </div>
                        <p className="p-8 text-center text-gray-500">{activeTab.replace('-', ' ')} management system will be implemented here.</p>
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen max-w-screen-2xl mx-auto bg-white shadow-lg">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50">
                <Header />
                {renderContent()}
            </main>
            <AddPatientModal
                isOpen={isAddPatientModalOpen}
                onClose={() => setAddPatientModalOpen(false)}
                onAddPatient={handleAddPatient}
            />
            <ScannerModal
                isOpen={isScannerModalOpen}
                onClose={() => setScannerModalOpen(false)}
                onScanSuccess={handleScannedPatient}
                showToast={showToast}
            />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default App;
