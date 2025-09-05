import { useState, useEffect, useCallback } from 'react';
import type { Patient, Appointment, ClinicData, ToothData, ExternalAccount, Treatment, LabOrder, ExpenditureItem, NewAppointmentData, AppointmentUpdateData, ClinicInfo } from '../types';
import { INITIAL_CLINIC_DATA, generateDefaultTeethChart } from '../constants';

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

export const useClinicData = () => {
    const [data, setData] = useState<ClinicData>(() => {
        try {
            const storedData = localStorage.getItem('clinicData');
            const parsedData = storedData ? JSON.parse(storedData) : INITIAL_CLINIC_DATA;
            // Ensure new fields exist for backward compatibility
            parsedData.patients = parsedData.patients.map((p: Patient) => ({
                ...p,
                firstVisit: p.firstVisit || p.lastVisit,
                visits: p.visits || [p.lastVisit],
                totalPayments: p.totalPayments || 0,
                treatments: p.treatments || [],
            }));
            parsedData.outlookAccounts = parsedData.outlookAccounts || [];
            parsedData.googleAccounts = parsedData.googleAccounts || [];
            parsedData.labOrders = parsedData.labOrders || [];
            if (parsedData.financials && !Array.isArray(parsedData.financials.expenditures)) {
                 // rough migration
                parsedData.financials.expenditures = INITIAL_CLINIC_DATA.financials.expenditures;
            }
            if (!parsedData.clinicInfo) {
                parsedData.clinicInfo = INITIAL_CLINIC_DATA.clinicInfo;
            }
            return parsedData;
        } catch (error) {
            console.error('Error parsing localStorage data:', error);
            return INITIAL_CLINIC_DATA;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('clinicData', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving data to localStorage:', error);
        }
    }, [data]);

    const addPatient = useCallback((newPatientData: NewPatientData) => {
        setData(prevData => {
            const now = new Date();
            const year = now.getFullYear();
            const newId = prevData.patients.length > 0 ? Math.max(...prevData.patients.map(p => p.id)) + 1 : 1;
            const patientCount = newId;
            const code = `PT-${year}-${patientCount.toString().padStart(3, '0')}`;

            const newPatient: Patient = {
                ...newPatientData,
                id: newId,
                code: code,
                lastVisit: newPatientData.firstVisit,
                visits: [newPatientData.firstVisit],
                totalPayments: 0,
                teethChart: generateDefaultTeethChart(),
                treatments: [],
            };
            return { ...prevData, patients: [newPatient, ...prevData.patients] };
        });
    }, []);
    
    const updatePatient = useCallback((updatedPatient: Patient) => {
        setData(prevData => {
            const patientExists = prevData.patients.some(p => p.id === updatedPatient.id);
            if (patientExists) {
                // Update existing patient
                return {
                    ...prevData,
                    patients: prevData.patients.map(p => p.id === updatedPatient.id ? updatedPatient : p)
                };
            } else {
                // Add as new patient
                return {
                    ...prevData,
                    patients: [updatedPatient, ...prevData.patients]
                };
            }
        });
    }, []);

    const updatePatientTeethChart = useCallback((patientId: number, toothId: string, updates: Partial<ToothData>) => {
        setData(prevData => {
            const updatedPatients = prevData.patients.map(p => {
                if (p.id === patientId) {
                    const currentChart = p.teethChart || generateDefaultTeethChart();
                    const currentToothData = currentChart[toothId] || { status: 'healthy', note: '' };
                    const newToothData = { ...currentToothData, ...updates };
                    const newTeethChart = { ...currentChart, [toothId]: newToothData };
                    return { ...p, teethChart: newTeethChart };
                }
                return p;
            });
            return { ...prevData, patients: updatedPatients };
        });
    }, []);

    const updateTreatment = useCallback((patientId: number, treatmentId: string, updates: Partial<Treatment>) => {
        setData(prevData => {
            const updatedPatients = prevData.patients.map(patient => {
                if (patient.id === patientId) {
                    const updatedTreatments = (patient.treatments || []).map(treatment => {
                        if (treatment.id === treatmentId) {
                            return { ...treatment, ...updates };
                        }
                        return treatment;
                    });
                    return { ...patient, treatments: updatedTreatments };
                }
                return patient;
            });
            return { ...prevData, patients: updatedPatients };
        });
    }, []);
    
    const deleteTreatment = useCallback((patientId: number, treatmentId: string) => {
        setData(prevData => {
            const updatedPatients = prevData.patients.map(patient => {
                if (patient.id === patientId) {
                    const updatedTreatments = (patient.treatments || []).filter(treatment => treatment.id !== treatmentId);
                    return { ...patient, treatments: updatedTreatments };
                }
                return patient;
            });
            return { ...prevData, patients: updatedPatients };
        });
    }, []);

    const addLabOrder = useCallback((newOrderData: NewLabOrderData) => {
        setData(prevData => {
            const patient = prevData.patients.find(p => p.id === newOrderData.patientId);
            if (!patient) return prevData;

            const newOrder: LabOrder = {
                ...newOrderData,
                id: `LO-${Date.now()}`,
                patientName: patient.name,
                creationDate: new Date().toISOString().split('T')[0],
                paymentStatus: 'unpaid',
            };
            return { ...prevData, labOrders: [newOrder, ...prevData.labOrders] };
        });
    }, []);

    const updateLabOrderStatus = useCallback((orderId: string, status: 'paid' | 'unpaid') => {
        setData(prevData => ({
            ...prevData,
            labOrders: prevData.labOrders.map(order => 
                order.id === orderId ? { ...order, paymentStatus: status } : order
            )
        }));
    }, []);
    
    const addExpenditure = useCallback((newExpenseData: NewExpenditureData) => {
        setData(prevData => {
            const newExpense: ExpenditureItem = {
                ...newExpenseData,
                id: `EXP-${Date.now()}`
            };
            const newFinancials = {
                ...prevData.financials,
                expenditures: [newExpense, ...prevData.financials.expenditures]
            };
            return { ...prevData, financials: newFinancials };
        });
    }, []);

    const addAppointment = useCallback((newAppointmentData: NewAppointmentData) => {
        setData(prevData => {
            const patient = prevData.patients.find(p => p.id === newAppointmentData.patientId);
            if (!patient) return prevData;

            const newId = prevData.appointments.length > 0 ? Math.max(...prevData.appointments.map(a => a.id)) + 1 : 1;
            
            let reminderDateTime: string | undefined = undefined;
            if (newAppointmentData.sendReminder) {
                const appointmentDate = new Date(`${newAppointmentData.date}T${newAppointmentData.time}`);
                appointmentDate.setDate(appointmentDate.getDate() - 1); // 24 hours before
                reminderDateTime = appointmentDate.toISOString();
            }

            const newAppointment: Appointment = {
                id: newId,
                patientId: newAppointmentData.patientId,
                patientName: patient.name,
                date: newAppointmentData.date,
                time: newAppointmentData.time,
                procedure: newAppointmentData.procedure,
                status: 'scheduled',
                source: 'clinic',
                reminderDateTime: reminderDateTime,
                reminderSent: false,
            };

            return { ...prevData, appointments: [...prevData.appointments, newAppointment] };
        });
    }, []);

    const updateAppointment = useCallback((updatedAppointmentData: AppointmentUpdateData) => {
        setData(prevData => {
            const patient = prevData.patients.find(p => p.id === updatedAppointmentData.patientId);
            if (!patient) return prevData;

            let reminderDateTime: string | undefined = undefined;
            if (updatedAppointmentData.sendReminder) {
                const appointmentDate = new Date(`${updatedAppointmentData.date}T${updatedAppointmentData.time}`);
                appointmentDate.setDate(appointmentDate.getDate() - 1);
                reminderDateTime = appointmentDate.toISOString();
            }

            const updatedAppointments = prevData.appointments.map(app => {
                if (app.id === updatedAppointmentData.id) {
                    const dateChanged = app.date !== updatedAppointmentData.date || app.time !== updatedAppointmentData.time;
                    return {
                        ...app,
                        patientId: updatedAppointmentData.patientId,
                        patientName: patient.name,
                        date: updatedAppointmentData.date,
                        time: updatedAppointmentData.time,
                        procedure: updatedAppointmentData.procedure,
                        status: updatedAppointmentData.status,
                        reminderDateTime: reminderDateTime,
                        // Reset reminderSent if date changed or reminder was re-enabled
                        reminderSent: (dateChanged || (reminderDateTime && !app.reminderDateTime)) ? false : app.reminderSent,
                    };
                }
                return app;
            });

            return { ...prevData, appointments: updatedAppointments };
        });
    }, []);

    const markReminderAsSent = useCallback((appointmentId: number) => {
        setData(prevData => ({
            ...prevData,
            appointments: prevData.appointments.map(app => 
                app.id === appointmentId ? { ...app, reminderSent: true } : app
            )
        }));
    }, []);

    const addOutlookAccount = useCallback((email: string) => {
        setData(prevData => {
            const newAccount: ExternalAccount = {
                id: Date.now().toString(),
                email,
                syncedAt: new Date().toISOString()
            };
            return { ...prevData, outlookAccounts: [...prevData.outlookAccounts, newAccount] };
        });
    }, []);

    const removeOutlookAccount = useCallback((id: string) => {
        setData(prevData => ({
            ...prevData,
            outlookAccounts: prevData.outlookAccounts.filter(acc => acc.id !== id)
        }));
    }, []);

    const addGoogleAccount = useCallback((email: string) => {
        setData(prevData => {
            const newAccount: ExternalAccount = {
                id: Date.now().toString(),
                email,
                backupAt: new Date().toISOString()
            };
            return { ...prevData, googleAccounts: [...prevData.googleAccounts, newAccount] };
        });
    }, []);

    const removeGoogleAccount = useCallback((id: string) => {
        setData(prevData => ({
            ...prevData,
            googleAccounts: prevData.googleAccounts.filter(acc => acc.id !== id)
        }));
    }, []);

    const updateClinicInfo = useCallback((updates: Partial<ClinicInfo>) => {
        setData(prevData => ({
            ...prevData,
            clinicInfo: { ...prevData.clinicInfo, ...updates }
        }));
    }, []);


    return {
        ...data,
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
        addOutlookAccount,
        removeOutlookAccount,
        addGoogleAccount,
        removeGoogleAccount,
        updateClinicInfo,
    };
};