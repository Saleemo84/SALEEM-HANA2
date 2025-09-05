
import type { ClinicData } from './types';

export const INITIAL_CLINIC_DATA: ClinicData = {
    patients: [
        { 
            id: 1, 
            name: 'Ahmed Mohamed', 
            code: 'PT-2023-001', 
            phone: '07507816500', 
            lastVisit: '2023-06-20', 
            balance: 0, 
            medicalConditions: 'None', 
            notes: 'Regular checkup every 6 months',
            nextAppointment: '2023-09-20'
        },
        { 
            id: 2, 
            name: 'Sarah Johnson', 
            code: 'PT-2023-002', 
            phone: '07501234567', 
            lastVisit: '2023-06-18', 
            balance: 150000, 
            medicalConditions: 'Diabetes', 
            notes: 'Needs follow-up in 3 months',
            nextAppointment: '2023-09-18'
        },
        { 
            id: 3, 
            name: 'John Smith', 
            code: 'PT-2023-003', 
            phone: '07507654321', 
            lastVisit: '2023-06-15', 
            balance: 0, 
            medicalConditions: 'None', 
            notes: 'Completed implant treatment',
            nextAppointment: '2023-09-15'
        },
        { 
            id: 4, 
            name: 'Rana Ali', 
            code: 'PT-2023-004', 
            phone: '07507816500', 
            lastVisit: '2023-07-01', 
            balance: 50000, 
            medicalConditions: 'None', 
            notes: 'Routine checkup',
            nextAppointment: '2023-10-01'
        }
    ],
    appointments: [
        { 
            id: 1, 
            patientId: 1, 
            patientName: 'Ahmed Mohamed', 
            date: new Date().toISOString().split('T')[0], 
            time: '14:30', 
            procedure: 'Ceramic Filling', 
            status: 'scheduled', 
            source: 'clinic' 
        },
        { 
            id: 2, 
            patientId: 2, 
            patientName: 'Sarah Johnson', 
            date: new Date().toISOString().split('T')[0], 
            time: '15:30', 
            procedure: 'Scaling and Polishing', 
            status: 'scheduled', 
            source: 'outlook' 
        },
        { 
            id: 3, 
            patientId: 4, 
            patientName: 'Rana Ali', 
            date: new Date().toISOString().split('T')[0], 
            time: '16:30', 
            procedure: 'Checkup', 
            status: 'completed', 
            source: 'clinic' 
        }
    ],
    financials: {
        income: {
            dentalTreatments: 3850000,
            diagnosisFees: 250000,
            otherIncome: 150000
        },
        expenditure: {
            labPayments: 850000,
            dentalSupplies: 450000,
            salaries: 1200000,
            rent: 750000,
            electricBill: 150000,
            otherExpenses: 200000
        }
    }
};
