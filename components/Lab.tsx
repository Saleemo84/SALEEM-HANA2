import React, { useState, useMemo } from 'react';
import type { Patient, LabOrder, ClinicInfo } from '../types';

// Declare jsPDF and autoTable from CDN
declare const jspdf: any;
declare const autoTable: any;
declare const QRCode: any;

interface LabProps {
    patients: Patient[];
    labOrders: LabOrder[];
    updateLabOrderStatus: (orderId: string, status: 'paid' | 'unpaid') => void;
    onAddLabOrderClick: () => void;
    clinicInfo: ClinicInfo;
}

const Lab: React.FC<LabProps> = ({ patients, labOrders, updateLabOrderStatus, onAddLabOrderClick, clinicInfo }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<{ key: keyof LabOrder, direction: 'asc' | 'desc' }>({ key: 'creationDate', direction: 'desc' });

    const monthlyLabSummary = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const summary = labOrders.reduce((acc, order) => {
            const orderDate = new Date(order.creationDate);
            if (order.paymentStatus === 'paid' && orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
                acc[order.labName] = (acc[order.labName] || 0) + order.cost;
            }
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(summary).sort((a, b) => b[1] - a[1]);
    }, [labOrders]);

    const sortedAndFilteredOrders = useMemo(() => {
        const filtered = labOrders.filter(order => 
            order.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.labName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.workType.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return filtered.sort((a, b) => {
            const valA = a[sortBy.key];
            const valB = b[sortBy.key];
            if (valA < valB) return sortBy.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortBy.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [labOrders, searchTerm, sortBy]);
    
    const handleSort = (key: keyof LabOrder) => {
        setSortBy(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleGenerateLabInvoice = async (order: LabOrder) => {
        const patient = patients.find(p => p.id === order.patientId);
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
        doc.text(`Invoice #: INV-${order.id.toUpperCase()}`, pageWidth - 20, 30, { align: "right" });
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
        doc.text(`Lab Order For: ${order.labName}`, 14, 74);
        
        // Calculate Day of Week
        const orderDate = new Date(order.creationDate);
        const dayOfWeek = orderDate.toLocaleDateString('en-US', { weekday: 'long' });

        // Table of services using autoTable
        autoTable(doc, {
            startY: 85,
            head: [['Creation Date', 'Day', 'Work Type', 'Shade', 'Cost (IQD)']],
            body: [
                [
                    order.creationDate,
                    dayOfWeek,
                    order.workType,
                    order.shade || '-',
                    { content: order.cost.toLocaleString(), styles: { halign: 'right' } }
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
        doc.text(`${order.cost.toLocaleString()} IQD`, pageWidth - 20, summaryY, { align: "right" });
        
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
        doc.text("This invoice is for lab work associated with your treatment.", pageWidth / 2, pageHeight - 10, { align: "center" });

        // Save the PDF
        doc.save(`LabInvoice-${patient.name.replace(/\s/g, '_')}-${order.id}.pdf`);
    };
    
    const SortableHeader: React.FC<{ headerKey: keyof LabOrder, title: string }> = ({ headerKey, title }) => (
        <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort(headerKey)}>
            {title}
            {sortBy.key === headerKey && <i className={`fas fa-arrow-${sortBy.direction === 'asc' ? 'up' : 'down'} ml-2`}></i>}
        </th>
    );

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-slate-200/80 p-4 md:p-6 animate-fadeIn">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-4 mb-6 gap-4">
                        <h2 className="text-xl font-bold text-slate-800">Lab Order Management</h2>
                        <button onClick={onAddLabOrderClick} className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-primary/20 transform hover:-translate-y-0.5">
                            <i className="fas fa-plus"></i> New Lab Order
                        </button>
                    </div>
                     <div className="relative w-full md:w-72 mb-6">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search patient, lab, or work type..."
                            className="w-full pl-4 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary transition"
                        />
                        <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                                <tr>
                                    <SortableHeader headerKey="patientName" title="Patient" />
                                    <SortableHeader headerKey="labName" title="Lab Name" />
                                    <th scope="col" className="px-6 py-3">Work Details</th>
                                    <SortableHeader headerKey="deliveryDate" title="Delivery" />
                                    <SortableHeader headerKey="cost" title="Cost (IQD)" />
                                    <SortableHeader headerKey="paymentStatus" title="Payment" />
                                    <th scope="col" className="px-6 py-3 text-center">Invoice</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedAndFilteredOrders.map(order => (
                                    <tr key={order.id} className="bg-white hover:bg-slate-50 border-b border-slate-200">
                                        <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{order.patientName}</th>
                                        <td className="px-6 py-4">{order.labName}</td>
                                        <td className="px-6 py-4">
                                            <p className="font-semibold">{order.workType}</p>
                                            <p className="text-xs text-slate-500">Shade: {order.shade}</p>
                                        </td>
                                        <td className="px-6 py-4">{order.deliveryDate}</td>
                                        <td className="px-6 py-4 font-semibold">{order.cost.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => updateLabOrderStatus(order.id, order.paymentStatus === 'paid' ? 'unpaid' : 'paid')}
                                                className={`text-xs font-bold py-1 px-3 rounded-full transition-colors ${
                                                    order.paymentStatus === 'paid' 
                                                    ? 'bg-success/20 text-green-700 hover:bg-success/30' 
                                                    : 'bg-error/20 text-error hover:bg-error/30'
                                                }`}
                                            >
                                                {order.paymentStatus === 'paid' ? <><i className="fas fa-check-circle mr-1.5"></i>Paid</> : <><i className="fas fa-hourglass-half mr-1.5"></i>Unpaid</>}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button 
                                                onClick={() => handleGenerateLabInvoice(order)}
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
                         {sortedAndFilteredOrders.length === 0 && (
                            <p className="text-center text-slate-500 py-8">No lab orders found.</p>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-slate-200/80 p-4 md:p-6 animate-fadeIn self-start">
                     <div className="border-b border-slate-200 pb-4 mb-4">
                        <h2 className="text-xl font-bold text-slate-800">Monthly Lab Payments</h2>
                        <p className="text-sm text-slate-500 mt-1">Total paid to labs this month.</p>
                    </div>
                    <div className="space-y-4">
                        {monthlyLabSummary.length > 0 ? (
                            monthlyLabSummary.map(([labName, total]) => (
                                <div key={labName} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                    <span className="font-semibold text-slate-800">{labName}</span>
                                    <span className="font-bold text-primary">{total.toLocaleString()} IQD</span>
                                </div>
                            ))
                        ) : (
                             <p className="text-center text-slate-500 py-8">No paid lab orders recorded this month.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Lab;