
export interface Patient {
    id: number;
    name: string;
    code: string;
    phone: string;
    lastVisit: string;
    balance: number;
    medicalConditions: string;
    notes: string;
    nextAppointment: string;
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
}

export interface Financials {
     income: {
        dentalTreatments: number;
        diagnosisFees: number;
        otherIncome: number;
    };
    expenditure: {
        labPayments: number;
        dentalSupplies: number;
        salaries: number;
        rent: number;
        electricBill: number;
        otherExpenses: number;
    };
}

export interface ClinicData {
    patients: Patient[];
    appointments: Appointment[];
    financials: Financials;
}
