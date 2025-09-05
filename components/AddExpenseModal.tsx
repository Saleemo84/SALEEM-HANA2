import React, { useState } from 'react';
import Modal from './Modal';
import type { ExpenditureItem } from '../types';

type NewExpenditureData = Omit<ExpenditureItem, 'id'>;

interface AddExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddExpense: (expense: NewExpenditureData) => void;
}

const expenseCategories: { value: ExpenditureItem['category'], label: string }[] = [
    { value: 'dentalSupplies', label: 'Dental Supplies' },
    { value: 'labPayments', label: 'Lab Payments' },
    { value: 'salaries', label: 'Salaries' },
    { value: 'rent', label: 'Rent' },
    { value: 'electricBill', label: 'Electric Bill' },
    { value: 'otherExpenses', label: 'Other Expenses' },
];

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose, onAddExpense }) => {
    const [itemName, setItemName] = useState('');
    const [category, setCategory] = useState<ExpenditureItem['category']>('dentalSupplies');
    const [cost, setCost] = useState<number>(0);
    const [expiryDate, setExpiryDate] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!itemName || cost <= 0) {
            alert('Please fill in item name and a valid cost.');
            return;
        }
        
        const expenseData: NewExpenditureData = {
            date,
            itemName,
            category,
            cost,
        };
        
        if (category === 'dentalSupplies' && expiryDate) {
            expenseData.expiryDate = expiryDate;
        }
        
        onAddExpense(expenseData);
        // Reset form
        setItemName('');
        setCategory('dentalSupplies');
        setCost(0);
        setExpiryDate('');
        setDate(new Date().toISOString().split('T')[0]);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Expense">
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label htmlFor="expenseItemName" className="block text-sm font-medium text-gray-700 mb-1">Item / Service Name</label>
                    <input type="text" id="expenseItemName" value={itemName} onChange={(e) => setItemName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" placeholder="e.g., Box of Gloves, Lab Fee" required/>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="expenseCategory" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select id="expenseCategory" value={category} onChange={(e) => setCategory(e.target.value as ExpenditureItem['category'])} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" required>
                            {expenseCategories.map(cat => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="expenseCost" className="block text-sm font-medium text-gray-700 mb-1">Cost (IQD)</label>
                        <input type="number" id="expenseCost" value={cost} onChange={(e) => setCost(Number(e.target.value))} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary" min="0" step="1000" required/>
                    </div>
                </div>
                
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                         <label htmlFor="expenseDate" className="block text-sm font-medium text-gray-700 mb-1">Date of Expense</label>
                         <input type="date" id="expenseDate" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"/>
                    </div>
                     {category === 'dentalSupplies' && (
                        <div>
                            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (Optional)</label>
                            <input type="date" id="expiryDate" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"/>
                        </div>
                    )}
                </div>
                
                <button type="submit" className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-sm">
                    <i className="fas fa-save"></i> Save Expense
                </button>
            </form>
        </Modal>
    );
};

export default AddExpenseModal;
