import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import FinanceChart from './FinanceChart';
import type { Financials, Patient, Treatment, ClinicInfo } from '../types';

// Declare jsPDF and autoTable from CDN
declare const jspdf: any;
declare const autoTable: any;
declare const QRCode: any;

interface FinanceProps {
    financials: Financials;
    patients: Patient[];
    onAddExpenseClick: () => void;
    clinicInfo: ClinicInfo;
}

const COLORS = ['#8b5cf6', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#ef4444'];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-2 border border-slate-300 rounded-md shadow-sm">
                <p className="font-semibold">{`${payload[0].name}`}</p>
                <p className="text-sm text-primary">{`Amount: ${payload[0].value.toLocaleString()} IQD`}</p>
            </div>
        );
    }
    return null;
};


const Finance: React.FC<FinanceProps> = ({ financials, patients, onAddExpenseClick, clinicInfo }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [invoiceSearchTerm, setInvoiceSearchTerm] = useState('');

    const expenditureData = useMemo(() => {
        const byCategory = financials.expenditures.reduce((acc, item) => {
            const categoryName = item.category.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
            acc[categoryName] = (acc[categoryName] || 0) + item.cost;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(byCategory).map(([name, value]) => ({ name, value }));
    }, [financials.expenditures]);

    const incomeBySourceData = useMemo(() => {
        const treatmentIncome = patients.flatMap(p => p.treatments || [])
            .filter(t => {
                if (!startDate || !endDate) return true;
                const treatmentDate = new Date(t.date);
                const start = new Date(startDate);
                const end = new Date(endDate);
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
                return treatmentDate >= start && treatmentDate <= end;
            })
            .reduce((acc, treatment) => {
                acc[treatment.procedure] = (acc[treatment.procedure] || 0) + treatment.cost;
                return acc;
            }, {} as Record<string, number>);
        
        const otherIncomeSources = {
            'Diagnosis Fees': financials.income.diagnosisFees,
            'Other Income': financials.income.otherIncome,
        };
        
        const combinedIncome = { ...treatmentIncome };
        
        if (!startDate || !endDate) {
            combinedIncome['Diagnosis Fees'] = otherIncomeSources['Diagnosis Fees'];
            combinedIncome['Other Income'] = otherIncomeSources['Other Income'];
        }

        return Object.entries(combinedIncome).map(([key, value]) => ({
            name: key,
            value,
        })).filter(item => item.value > 0);
    }, [patients, financials.income, startDate, endDate]);

    const treatmentIncomeBreakdown = useMemo(() => {
        const breakdown = patients
            .flatMap(p => p.treatments || [])
            .reduce((acc, treatment) => {
                acc[treatment.procedure] = (acc[treatment.procedure] || 0) + treatment.cost;
                return acc;
            }, {} as Record<string, number>);
    
        const totalTreatmentIncome = Object.values(breakdown).reduce((sum, current) => sum + current, 0);
    
        return Object.entries(breakdown)
            .map(([name, total]) => ({
                name,
                total,
                percentage: totalTreatmentIncome > 0 ? (total / totalTreatmentIncome) * 100 : 0,
            }))
            .sort((a, b) => b.total - a.total);
    }, [patients]);
    
    const getExpiryStatus = (expiryDate?: string) => {
        if (!expiryDate) return { text: '-', color: 'text-slate-500' };
        const now = new Date();
        const expiry = new Date(expiryDate);
        const diffTime = expiry.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return { text: 'Expired', color: 'text-white bg-error rounded-full px-2 py-0.5' };
        if (diffDays <= 30) return { text: `${diffDays} days left`, color: 'text-white bg-warning rounded-full px-2 py-0.5' };
        return { text: expiryDate, color: 'text-slate-700' };
    };

    const sortedExpenditures = useMemo(() => 
        [...financials.expenditures].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    , [financials.expenditures]);

    const allTreatments = useMemo(() => {
        return patients
            .flatMap(patient =>
                (patient.treatments || []).map(treatment => ({
                    ...treatment,
                    patientName: patient.name,
                    patientId: patient.id,
                }))
            )
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [patients]);

    const filteredTreatmentsForInvoice = useMemo(() => {
        if (!invoiceSearchTerm) return allTreatments;
        const lowercasedTerm = invoiceSearchTerm.toLowerCase();
        return allTreatments.filter(
            (treatment) =>
                treatment.patientName.toLowerCase().includes(lowercasedTerm) ||
                treatment.procedure.toLowerCase().includes(lowercasedTerm)
        );
    }, [allTreatments, invoiceSearchTerm]);

    const handleGenerateInvoice = async (treatment: (typeof allTreatments)[0]) => {
        const patient = patients.find(p => p.id === treatment.patientId);
        if (!patient) {
            console.error("Patient not found for invoice generation.");
            return;
        }

        const { jsPDF } = jspdf;
        const doc = new jsPDF();
        const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

        // Header
        if (clinicInfo.logoBase64) {
             doc.addImage(clinicInfo.logoBase64, 'PNG', 14, 12, 30, 30);
        }
        doc.setFontSize(20);
        doc.setTextColor(40);
        doc.setFont("helvetica", "bold");
        doc.text(clinicInfo.name, 50, 22);
        
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.setFont("helvetica", "normal");
        doc.text(clinicInfo.address, 50, 28);
        doc.text(`Phone: ${clinicInfo.phone}`, 50, 33);
        doc.text(`Email: ${clinicInfo.email}`, 50, 38);

        // Invoice Title & Details
        doc.setFontSize(28);
        doc.setFont("helvetica", "bold");
        doc.setTextColor('#334155');
        doc.text("INVOICE", pageWidth - 20, 22, { align: "right" });

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const issueDate = new Date().toLocaleDateString('en-CA');
        doc.text(`Invoice #: INV-${treatment.id.toUpperCase()}`, pageWidth - 20, 30, { align: "right" });
        doc.text(`Date Issued: ${issueDate}`, pageWidth - 20, 35, { align: "right" });

        // Bill To Section
        doc.setDrawColor(226, 232, 240); // slate-200
        doc.line(14, 48, pageWidth - 14, 48);

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor('#334155');
        doc.text("Bill To:", 14, 58);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(82, 82, 91); // zinc-600
        doc.text(patient.name, 14, 64);
        doc.text(`Patient ID: ${patient.code}`, 14, 69);
        doc.text(`Phone: ${patient.phone}`, 14, 74);
        
        // Calculate Day of Week
        const visitDate = new Date(treatment.date);
        const dayOfWeek = visitDate.toLocaleDateString('en-US', { weekday: 'long' });

        // Table of services using autoTable
        autoTable(doc, {
            startY: 85,
            head: [['Date', 'Day', 'Time', 'Procedure', 'Notes', 'Cost (IQD)']],
            body: [
                [
                    treatment.date,
                    dayOfWeek,
                    treatment.time,
                    treatment.procedure,
                    treatment.notes || '-',
                    { content: treatment.cost.toLocaleString(), styles: { halign: 'right' } }
                ]
            ],
            theme: 'striped',
            headStyles: { fillColor: [139, 92, 246] }, // primary color
        });
        
        // Totals and Payment Summary
        const finalY = (doc as any).lastAutoTable.finalY;
        let summaryY = finalY + 10;
        const paymentSummaryX = pageWidth - 70;
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        
        doc.text("Total Payments Made:", paymentSummaryX, summaryY);
        doc.text(`${patient.totalPayments.toLocaleString()} IQD`, pageWidth - 20, summaryY, { align: "right" });
        summaryY += 6;

        doc.text("Outstanding Balance:", paymentSummaryX, summaryY);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(239, 68, 68); // error color
        doc.text(`${patient.balance.toLocaleString()} IQD`, pageWidth - 20, summaryY, { align: "right" });
        summaryY += 6;

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.setDrawColor(226, 232, 240); // slate-200
        doc.line(paymentSummaryX - 5, summaryY, pageWidth - 14, summaryY); // separator line
        summaryY += 6;
        doc.text("Service Total:", paymentSummaryX, summaryY);
        doc.text(`${treatment.cost.toLocaleString()} IQD`, pageWidth - 20, summaryY, { align: "right" });

        // Footer Area
        const leftFooterY = pageHeight - 45;

        // QR Code
        try {
            const qrText = `Doctor: ${clinicInfo.name}\nPhone: ${clinicInfo.phone}`;
            const qrCodeDataUrl = await QRCode.toDataURL(qrText, { errorCorrectionLevel: 'H' });
            doc.addImage(qrCodeDataUrl, 'PNG', 14, leftFooterY, 30, 30);
        } catch (err) {
            console.error('Failed to generate QR code', err);
        }
        
        // Next Appointment
        if (patient.nextAppointment) {
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(15, 116, 144); // text-cyan-700
            doc.text("Next Appointment:", 50, leftFooterY + 10);
            doc.setFont("helvetica", "normal");
            doc.text(patient.nextAppointment, 50, leftFooterY + 16);
        }

        // Centered Footer Text
        doc.setFontSize(9);
        doc.setTextColor(150);
        doc.text(`Thank you for choosing ${clinicInfo.name}.`, pageWidth / 2, pageHeight - 15, { align: "center" });
        doc.text("Please make payments at the front desk.", pageWidth / 2, pageHeight - 10, { align: "center" });

        // Save the PDF
        doc.save(`Invoice-${patient.name.replace(/\s/g, '_')}-${treatment.id}.pdf`);
    };


    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200/80 p-4 md:p-6 animate-fadeIn">
                <div className="border-b border-slate-200 pb-4 mb-4">
                    <h2 className="text-xl font-bold text-slate-800">Financial Overview</h2>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Income vs Expenditure (Monthly)</h3>
                    <p className="text-sm text-slate-600 mb-4">
                        A general monthly comparison between total clinic income and expenditure.
                    </p>
                    <FinanceChart />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200/80 p-4 md:p-6 animate-fadeIn">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-4 mb-6 gap-4">
                    <h3 className="text-lg font-bold text-slate-800">Detailed Pie Chart Reports</h3>
                     <div className="flex items-center gap-2 flex-wrap">
                        <label htmlFor="startDate" className="text-sm font-medium text-slate-700">From:</label>
                        <input 
                            id="startDate"
                            type="date" 
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="p-2 border border-slate-300 rounded-md text-sm focus:ring-primary focus:border-primary"
                        />
                        <label htmlFor="endDate" className="text-sm font-medium text-slate-700">To:</label>
                         <input
                            id="endDate"
                            type="date" 
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="p-2 border border-slate-300 rounded-md text-sm focus:ring-primary focus:border-primary"
                        />
                     </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-center font-semibold text-slate-700 mb-4">Income by Source</h4>
                        {incomeBySourceData.length > 0 ? (
                             <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={incomeBySourceData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                        nameKey="name"
                                    >
                                        {incomeBySourceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-center text-slate-500 py-8">No income data available for the selected period.</p>
                        )}
                    </div>
                    <div>
                        <h4 className="text-center font-semibold text-slate-700 mb-4">Expenditure by Category</h4>
                         <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={expenditureData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                >
                                    {expenditureData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200/80 p-4 md:p-6 animate-fadeIn">
                <div className="border-b border-slate-200 pb-4 mb-4">
                    <h2 className="text-xl font-bold text-slate-800">Income Breakdown by Treatment</h2>
                    <p className="text-sm text-slate-500 mt-1">A detailed look at revenue generated from each procedure.</p>
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {treatmentIncomeBreakdown.length > 0 ? (
                        treatmentIncomeBreakdown.map((item, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium text-slate-700">{item.name}</span>
                                    <span className="font-semibold text-primary">{item.total.toLocaleString()} IQD</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2.5">
                                    <div 
                                        className="bg-gradient-to-r from-accent to-sky-500 h-2.5 rounded-full" 
                                        style={{ width: `${item.percentage}%` }}
                                        title={`${item.percentage.toFixed(1)}%`}
                                    ></div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-slate-500 py-8">No treatment data available to generate a breakdown.</p>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200/80 p-4 md:p-6 animate-fadeIn">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-4 mb-6 gap-4">
                    <h2 className="text-xl font-bold text-slate-800">Treatment Invoicing</h2>
                    <div className="relative w-full md:w-72">
                        <input
                            type="text"
                            value={invoiceSearchTerm}
                            onChange={(e) => setInvoiceSearchTerm(e.target.value)}
                            placeholder="Search patient or procedure..."
                            className="w-full pl-4 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary transition"
                        />
                        <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">Patient</th>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">Procedure</th>
                                <th scope="col" className="px-6 py-3 text-right">Cost (IQD)</th>
                                <th scope="col" className="px-6 py-3 text-center">Invoice</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTreatmentsForInvoice.map((treatment) => (
                                <tr key={treatment.id} className="bg-white hover:bg-slate-50 border-b border-slate-200">
                                    <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{treatment.patientName}</th>
                                    <td className="px-6 py-4">{treatment.date}</td>
                                    <td className="px-6 py-4">{treatment.procedure}</td>
                                    <td className="px-6 py-4 font-semibold text-slate-800 text-right">{treatment.cost.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            onClick={() => handleGenerateInvoice(treatment)}
                                            className="font-medium text-primary hover:text-primary-dark transition-colors" 
                                            title="Generate PDF Invoice"
                                        >
                                            <i className="fas fa-file-pdf text-xl"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredTreatmentsForInvoice.length === 0 && (
                        <p className="text-center text-slate-500 py-8">No treatments found.</p>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200/80 p-4 md:p-6 animate-fadeIn">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-4 mb-6 gap-4">
                    <h2 className="text-xl font-bold text-slate-800">Expenditure Log</h2>
                    <button onClick={onAddExpenseClick} className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-primary/20 transform hover:-translate-y-0.5">
                        <i className="fas fa-plus"></i> Add Expense
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">Item/Service</th>
                                <th scope="col" className="px-6 py-3">Category</th>
                                <th scope="col" className="px-6 py-3">Expiry Date</th>
                                <th scope="col" className="px-6 py-3 text-right">Cost (IQD)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedExpenditures.map((item) => {
                                const expiryStatus = getExpiryStatus(item.expiryDate);
                                return (
                                    <tr key={item.id} className="bg-white hover:bg-slate-50 border-b border-slate-200">
                                        <td className="px-6 py-4">{item.date}</td>
                                        <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                                            {item.itemName}
                                        </th>
                                        <td className="px-6 py-4">{item.category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-semibold ${expiryStatus.color}`}>{expiryStatus.text}</span>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-slate-800 text-right">
                                            {item.cost.toLocaleString()}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {sortedExpenditures.length === 0 && (
                        <p className="text-center text-slate-500 py-8">No expenditure records found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Finance;