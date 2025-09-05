export type ToothStatus = 'healthy' | 'missing' | 'filling' | 'crown' | 'root_canal' | 'extraction_planned' | 'implant' | 'veneer' | 'decay';

export interface ToothData {
    status: ToothStatus;
    note: string;
}

export interface Treatment {
    id: string;
    date: string;
    time: string;
    procedure: string;
    notes?: string;
    cost: number;
    xrayUrl?: string; // URL to the stored x-ray image
}

export interface Patient {
    id: number;
    name: string;
    code: string;
    phone: string;
    lastVisit: string;
    firstVisit: string;
    visits: string[];
    totalPayments: number;
    balance: number;
    medicalConditions: string;
    notes: string;
    nextAppointment: string;
    teethChart?: { [toothId: string]: ToothData };
    treatments?: Treatment[];
}

export interface Appointment {
    id: number;
    patientId: number;
    patientName: string;
    date: string;
    time: string;
    procedure: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    source: 'clinic' | 'outlook';
    reminderDateTime?: string;
    reminderSent?: boolean;
}

export interface ExpenditureItem {
    id: string;
    date: string;
    itemName: string;
    category: 'labPayments' | 'dentalSupplies' | 'salaries' | 'rent' | 'electricBill' | 'otherExpenses';
    cost: number;
    expiryDate?: string;
}

export interface Financials {
     income: {
        dentalTreatments: number;
        diagnosisFees: number;
        otherIncome: number;
    };
    expenditures: ExpenditureItem[];
}

export interface ExternalAccount {
    id: string;
    email: string;
    syncedAt?: string;
    backupAt?: string;
}

export interface LabOrder {
    id: string;
    patientId: number;
    patientName: string;
    labName: string;
    shade: string;
    workType: string;
    deliveryDate: string;
    cost: number;
    paymentStatus: 'paid' | 'unpaid';
    creationDate: string;
}

export interface ClinicInfo {
    name: string;
    address: string;
    phone: string;
    email: string;
    logoBase64?: string;
}

export interface ClinicData {
    patients: Patient[];
    appointments: Appointment[];
    financials: Financials;
    outlookAccounts: ExternalAccount[];
    googleAccounts: ExternalAccount[];
    labOrders: LabOrder[];
    clinicInfo: ClinicInfo;
}

export interface NewAppointmentData {
    patientId: number;
    date: string;
    time: string;
    procedure: string;
    sendReminder: boolean;
}

export interface AppointmentUpdateData extends NewAppointmentData {
    id: number;
    status: 'scheduled' | 'completed' | 'cancelled';
}

export type AppointmentFormData = NewAppointmentData & {
    id?: number;
    status?: 'scheduled' | 'completed' | 'cancelled';
};