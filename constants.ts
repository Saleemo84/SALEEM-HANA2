import type { ClinicData, ToothStatus, ToothData } from './types';

export const STATUS_CONFIG: { [key in ToothStatus]: { bg: string; text: string; border: string; label: string; icon?: string; hex: string; } } = {
    healthy: { bg: 'bg-white', text: 'text-gray-700', border: 'border-gray-300', label: 'Healthy', icon: 'fa-tooth', hex: '#FFFFFF' },
    decay: { bg: 'bg-orange-500', text: 'text-white', border: 'border-orange-500', label: 'Decay', icon: 'fa-bug', hex: '#F97316' },
    filling: { bg: 'bg-blue-400', text: 'text-white', border: 'border-blue-400', label: 'Filling', icon: 'fa-circle', hex: '#60A5FA' },
    crown: { bg: 'bg-yellow-400', text: 'text-gray-800', border: 'border-yellow-400', label: 'Crown', icon: 'fa-crown', hex: '#FBBF24' },
    veneer: { bg: 'bg-pink-300', text: 'text-gray-800', border: 'border-pink-300', label: 'Veneer', icon: 'fa-star', hex: '#F9A8D4' },
    implant: { bg: 'bg-indigo-500', text: 'text-white', border: 'border-indigo-500', label: 'Implant', icon: 'fa-thumbtack', hex: '#6366F1' },
    root_canal: { bg: 'bg-purple-500', text: 'text-white', border: 'border-purple-500', label: 'Root Canal', icon: 'fa-code-branch', hex: '#A855F7' },
    extraction_planned: { bg: 'bg-red-500', text: 'text-white', border: 'border-red-500', label: 'To be Extracted', icon: 'fa-times-circle', hex: '#EF4444' },
    missing: { bg: 'bg-gray-700', text: 'text-white', border: 'border-gray-700', label: 'Missing', icon: 'fa-ban', hex: '#374151' },
};

export const generateDefaultTeethChart = (): { [toothId: string]: ToothData } => {
    const chart: { [toothId: string]: ToothData } = {};
    for (let i = 1; i <= 32; i++) {
        chart[i.toString()] = { status: 'healthy', note: '' };
    }
    return chart;
};


export const INITIAL_CLINIC_DATA: ClinicData = {
    patients: [
        { 
            id: 1, 
            name: 'Ahmed Mohamed', 
            code: 'PT-2025-001', 
            phone: '07507816500', 
            lastVisit: '2025-06-20',
            firstVisit: '2025-01-10',
            visits: ['2025-01-10', '2025-03-15', '2025-05-20', '2025-06-20'],
            totalPayments: 500000,
            balance: 0, 
            medicalConditions: 'None', 
            notes: 'Regular checkup every 6 months',
            nextAppointment: '2025-12-20',
            teethChart: {
                ...generateDefaultTeethChart(),
                '3': { status: 'filling', note: 'Composite filling done on 2025-01-10.' },
                '14': { status: 'filling', note: '' },
                '19': { status: 'crown', note: 'Porcelain crown placed after root canal.' },
                '30': { status: 'missing', note: 'Extracted due to severe decay in 2025.' },
            },
            treatments: [
                { id: 't1', date: '2025-01-10', time: '10:00', procedure: 'Composite filling', cost: 75000, xrayUrl: 'sample-xray-1.jpg' },
                { id: 't2', date: '2025-06-20', time: '11:30', procedure: 'Checkup', cost: 25000 }
            ]
        },
        { 
            id: 2, 
            name: 'Sarah Johnson', 
            code: 'PT-2025-002', 
            phone: '07501234567', 
            lastVisit: '2025-06-18', 
            firstVisit: '2025-03-10',
            visits: ['2025-03-10', '2025-05-15', '2025-06-18'],
            totalPayments: 350000,
            balance: 150000, 
            medicalConditions: 'Diabetes', 
            notes: 'Needs follow-up in 3 months',
            nextAppointment: '2025-09-18',
            teethChart: {
                ...generateDefaultTeethChart(),
                '8': { status: 'veneer', note: 'E-max veneer.' },
                '9': { status: 'veneer', note: 'E-max veneer, slight discoloration reported.' },
                '29': { status: 'decay', note: 'Initial decay detected on mesial surface.' },
                '18': { status: 'extraction_planned', note: 'Non-restorable, planned for extraction next visit.' },
            },
            treatments: [
                { id: 't3', date: '2025-05-15', time: '09:45', procedure: 'Veneer Placement', cost: 400000, xrayUrl: 'sample-xray-2.jpg' },
            ]
        },
        { 
            id: 3, 
            name: 'John Smith', 
            code: 'PT-2025-003', 
            phone: '07507654321', 
            lastVisit: '2025-06-15', 
            firstVisit: '2025-01-22',
            visits: ['2025-01-22', '2025-04-10', '2025-06-15'],
            totalPayments: 1200000,
            balance: 0, 
            medicalConditions: 'None', 
            notes: 'Completed implant treatment',
            nextAppointment: '2025-12-15',
            teethChart: {
                ...generateDefaultTeethChart(),
                '1': { status: 'root_canal', note: 'Completed RCT, awaiting crown.' },
                '16': { status: 'root_canal', note: '' },
                '5': { status: 'implant', note: 'Implant placed in 2025, stable.' }
            },
            treatments: [
                 { id: 't4', date: '2025-01-22', time: '15:00', procedure: 'Implant Surgery', cost: 1000000, xrayUrl: 'sample-xray-3.jpg' }
            ]
        },
        { 
            id: 4, 
            name: 'Rana Ali', 
            code: 'PT-2025-004', 
            phone: '07507816500', 
            lastVisit: '2025-07-01', 
            firstVisit: '2025-07-01',
            visits: ['2025-07-01'],
            totalPayments: 50000,
            balance: 50000, 
            medicalConditions: 'None', 
            notes: 'Routine checkup',
            nextAppointment: '2026-01-01',
            teethChart: generateDefaultTeethChart(),
            treatments: []
        }
    ],
    appointments: [
        { 
            id: 1, 
            patientId: 1, 
            patientName: 'Ahmed Mohamed', 
            date: '2025-07-28', 
            time: '14:30', 
            procedure: 'Ceramic Filling', 
            status: 'scheduled', 
            source: 'clinic',
            reminderDateTime: '2025-07-27T14:30:00.000Z',
            reminderSent: false
        },
        { 
            id: 2, 
            patientId: 2, 
            patientName: 'Sarah Johnson', 
            date: '2025-07-28', 
            time: '15:30', 
            procedure: 'Scaling and Polishing', 
            status: 'scheduled', 
            source: 'outlook',
            reminderSent: false
        },
        { 
            id: 3, 
            patientId: 4, 
            patientName: 'Rana Ali', 
            date: '2025-07-25',
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
        expenditures: [
            { id: 'e1', date: '2025-06-01', itemName: 'Premium Lab Services', category: 'labPayments', cost: 850000 },
            { id: 'e2', date: '2025-06-05', itemName: 'Composite Resin Pack', category: 'dentalSupplies', cost: 250000, expiryDate: '2026-12-31' },
            { id: 'e3', date: '2025-06-05', itemName: 'Gloves and Masks', category: 'dentalSupplies', cost: 200000 },
            { id: 'e4', date: '2025-06-15', itemName: 'Staff Salaries - June', category: 'salaries', cost: 1200000 },
            { id: 'e5', date: '2025-06-20', itemName: 'Clinic Rent - June', category: 'rent', cost: 750000 },
            { id: 'e6', date: '2025-06-25', itemName: 'Electricity Bill', category: 'electricBill', cost: 150000 },
            { id: 'e7', date: '2025-06-28', itemName: 'Miscellaneous Expenses', category: 'otherExpenses', cost: 200000 },
        ]
    },
    outlookAccounts: [],
    googleAccounts: [],
    labOrders: [],
    clinicInfo: {
        name: 'Dr Saleem Andraws Dental Clinic',
        address: '123 Dental Street, Erbil, Kurdistan Region of Iraq',
        phone: '+964 750 123 4567',
        email: 'contact@drsaleemandraws.com',
        logoBase64: '', // Initially no logo
    }
};