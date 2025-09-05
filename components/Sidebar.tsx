
import React from 'react';

type Tab = 'dashboard' | 'patients' | 'appointments' | 'finance' | 'treatments' | 'teeth-chart' | 'lab' | 'outlook' | 'backup' | 'settings';

interface NavItem {
    id: Tab;
    label: string;
    icon: string;
}

const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-home' },
    { id: 'patients', label: 'Patients', icon: 'fa-user-injured' },
    { id: 'appointments', label: 'Appointments', icon: 'fa-calendar-check' },
    { id: 'finance', label: 'Finance', icon: 'fa-money-bill-wave' },
    { id: 'treatments', label: 'Treatments', icon: 'fa-teeth' },
    { id: 'teeth-chart', label: 'Teeth Chart', icon: 'fa-tooth' },
    { id: 'lab', label: 'Lab', icon: 'fa-flask' },
    { id: 'outlook', label: 'Outlook Sync', icon: 'fa-sync-alt' },
    { id: 'backup', label: 'Backup', icon: 'fa-cloud-upload-alt' },
    { id: 'settings', label: 'Settings', icon: 'fa-cog' },
];

interface SidebarProps {
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
    return (
        <aside className="w-full lg:w-64 bg-slate-800 text-slate-100 p-4 lg:p-6 flex-shrink-0 lg:rounded-l-xl">
            <div className="flex items-center mb-10 px-2">
                <i className="fas fa-tooth text-4xl mr-3 text-accent"></i>
                <span className="text-xl font-bold">Dental Clinic</span>
            </div>
            <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2">
                {navItems.map((item) => (
                    <div
                        key={item.id}
                        className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 whitespace-nowrap group ${
                            activeTab === item.id
                                ? 'bg-primary text-white font-semibold shadow-lg shadow-primary/30'
                                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                        }`}
                        onClick={() => setActiveTab(item.id)}
                    >
                        <i className={`fas ${item.icon} text-xl w-8 text-center transition-transform duration-300 group-hover:scale-110`}></i>
                        <span className="ml-3 hidden lg:inline">{item.label}</span>
                    </div>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;