import React, { useState } from 'react';
import type { ExternalAccount } from '../types';
import Modal from './Modal';

interface OutlookSyncProps {
    accounts: ExternalAccount[];
    onAddAccount: (email: string) => void;
    onRemoveAccount: (id: string) => void;
    showToast: (message: string, type?: 'success' | 'error') => void;
}

const AddAccountModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onAdd: (email: string) => void;
    serviceName: string;
}> = ({ isOpen, onClose, onAdd, serviceName }) => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            alert('Please enter an email address.');
            return;
        }
        onAdd(email);
        setEmail('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Connect ${serviceName} Account`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="accountEmail" className="block text-sm font-medium text-slate-700 mb-1">Account Email</label>
                    <input
                        type="email"
                        id="accountEmail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
                        placeholder={`Enter ${serviceName} email address`}
                        required
                    />
                </div>
                <p className="text-xs text-slate-500">
                    In a real application, clicking 'Connect' would initiate an OAuth flow to securely connect your account. For this demo, we are just adding the email address.
                </p>
                <button type="submit" className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-sm">
                    <i className="fas fa-link"></i> Connect Account
                </button>
            </form>
        </Modal>
    );
};

const OutlookSync: React.FC<OutlookSyncProps> = ({ accounts, onAddAccount, onRemoveAccount, showToast }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    
    const handleAddAccount = (email: string) => {
        onAddAccount(email);
        showToast(`Outlook account ${email} connected successfully!`);
    };

    const handleRemoveAccount = (id: string, email: string) => {
        onRemoveAccount(id);
        showToast(`Outlook account ${email} disconnected.`);
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm border border-slate-200/80 p-4 md:p-6 animate-fadeIn">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-4 mb-6 gap-4">
                    <h2 className="text-xl font-semibold text-slate-800">Outlook Account Sync</h2>
                    <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-sm">
                        <i className="fab fa-outlook"></i> Add Outlook Account
                    </button>
                </div>

                {accounts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {accounts.map(account => (
                            <div key={account.id} className="bg-slate-50 p-5 rounded-lg border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
                                <div className="flex items-center gap-4 mb-3">
                                    <i className="fab fa-outlook text-3xl text-blue-600"></i>
                                    <div>
                                        <p className="font-semibold text-slate-800 truncate">{account.email}</p>
                                        <p className="text-xs text-slate-500">
                                            Last Synced: {account.syncedAt ? new Date(account.syncedAt).toLocaleString() : 'Never'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemoveAccount(account.id, account.email)}
                                    className="w-full text-center text-xs px-3 py-2 bg-error text-white rounded-md hover:bg-red-600 transition-colors"
                                >
                                    <i className="fas fa-unlink mr-1"></i> Disconnect
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                         <i className="fab fa-outlook text-5xl text-slate-300 mb-4"></i>
                        <p className="text-slate-500">No Outlook accounts connected.</p>
                        <p className="text-sm text-slate-400 mt-2">Add an account to sync your appointments.</p>
                    </div>
                )}
            </div>
            <AddAccountModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onAdd={handleAddAccount}
                serviceName="Outlook"
            />
        </>
    );
};

export default OutlookSync;