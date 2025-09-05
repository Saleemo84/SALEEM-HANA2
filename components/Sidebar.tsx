
import React from 'react';

type Tab = 'dashboard' | 'patients' | 'appointments' | 'finance' | 'treatments' | 'teeth-chart' | 'outlook' | 'backup';

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
    { id: 'outlook', label: 'Outlook Sync', icon: 'fa-sync-alt' },
    { id: 'backup', label: 'Backup', icon: 'fa-cloud-upload-alt' },
];

interface SidebarProps {
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
    return (
        <aside className="w-full lg:w-64 bg-primary text-white p-4 lg:p-6 flex-shrink-0">
            <div className="flex items-center mb-8 px-2">
                <i className="fas fa-tooth text-3xl mr-3"></i>
                <span className="text-xl font-bold">Dr. Saleem Dental Clinic</span>
            </div>
            <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2">
                {navItems.map((item) => (
                    <div
                        key={item.id}
                        className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 whitespace-nowrap ${
                            activeTab === item.id
                                ? 'bg-white/20 shadow-sm'
                                : 'hover:bg-white/10'
                        }`}
                        onClick={() => setActiveTab(item.id)}
                    >
                        <i className={`fas ${item.icon} text-xl w-8 text-center`}></i>
                        <span className="ml-3 hidden lg:inline">{item.label}</span>
                    </div>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
