
import { useState, useEffect, useCallback } from 'react';
import type { Patient, Appointment, ClinicData } from '../types';
import { INITIAL_CLINIC_DATA } from '../constants';

export const useClinicData = () => {
    const [data, setData] = useState<ClinicData>(() => {
        try {
            const storedData = localStorage.getItem('clinicData');
            return storedData ? JSON.parse(storedData) : INITIAL_CLINIC_DATA;
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

    const addPatient = useCallback((newPatientData: Omit<Patient, 'id' | 'code' | 'lastVisit'>) => {
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
                lastVisit: now.toISOString().split('T')[0],
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

    return {
        ...data,
        addPatient,
        updatePatient,
    };
};
