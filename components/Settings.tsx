import React, { useState } from 'react';
import type { ClinicInfo } from '../types';

interface SettingsProps {
    clinicInfo: ClinicInfo;
    updateClinicInfo: (updates: Partial<ClinicInfo>) => void;
    showToast: (message: string, type?: 'success' | 'error') => void;
}

const Settings: React.FC<SettingsProps> = ({ clinicInfo, updateClinicInfo, showToast }) => {
    const [formState, setFormState] = useState<ClinicInfo>(clinicInfo);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prevState => ({ ...prevState, [name]: value }));
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormState(prevState => ({ ...prevState, logoBase64: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateClinicInfo(formState);
        showToast('Clinic settings updated successfully!', 'success');
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200/80 p-4 md:p-6 animate-fadeIn">
            <div className="border-b border-slate-200 pb-4 mb-6">
                <h2 className="text-xl font-bold text-slate-800">Clinic Settings</h2>
                <p className="text-sm text-slate-500 mt-1">Customize the information that appears on your invoices and documents.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Info Fields */}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Clinic Name</label>
                            <input type="text" id="name" name="name" value={formState.name} onChange={handleInputChange} className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"/>
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                            <input type="text" id="address" name="address" value={formState.address} onChange={handleInputChange} className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"/>
                        </div>
                         <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                            <input type="tel" id="phone" name="phone" value={formState.phone} onChange={handleInputChange} className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"/>
                        </div>
                         <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <input type="email" id="email" name="email" value={formState.email} onChange={handleInputChange} className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"/>
                        </div>
                    </div>

                    {/* Logo Upload */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Clinic Logo</label>
                        <div className="mt-1 flex items-center gap-5">
                            <div className="h-24 w-24 rounded-md bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                                {formState.logoBase64 ? (
                                    <img src={formState.logoBase64} alt="Clinic Logo Preview" className="h-full w-full object-contain" />
                                ) : (
                                    <i className="fas fa-image text-4xl text-slate-400"></i>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="logo-upload" className="cursor-pointer bg-white py-2 px-3 border border-slate-300 rounded-md shadow-sm text-sm leading-4 font-medium text-slate-700 hover:bg-slate-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                                    <span>Upload new logo</span>
                                    <input id="logo-upload" name="logo-upload" type="file" className="sr-only" accept="image/png, image/jpeg" onChange={handleLogoChange}/>
                                </label>
                                <button type="button" onClick={() => setFormState(prev => ({...prev, logoBase64: ''}))} className="text-xs text-error hover:underline">
                                    Remove logo
                                </button>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">Recommended: PNG or JPG, max 1MB.</p>
                    </div>
                </div>

                <div className="pt-5 border-t border-slate-200">
                    <div className="flex justify-end">
                        <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-all duration-300 shadow-sm hover:shadow-lg transform hover:-translate-y-0.5">
                            <i className="fas fa-save"></i> Save Settings
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Settings;
