
import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
    const [time, setTime] = useState(new Date());
    const [canCast, setCanCast] = useState(false);

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        // @ts-ignore - Presentation API might not be on the default navigator type
        setCanCast(!!navigator.presentation);
        return () => clearInterval(timerId);
    }, []);

    const handleCast = async () => {
        // @ts-ignore
        if (!navigator.presentation) return;
        // @ts-ignore
        const presentationRequest = new navigator.presentation.PresentationRequest([window.location.href]);
        try {
            const connection = await presentationRequest.start();
            // You can listen to connection events here if needed
        } catch (error) {
            console.error('Error starting presentation:', error);
        }
    };


    return (
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
                 <h1 className="text-2xl font-bold text-slate-800">Welcome Back, Doctor</h1>
                 <p className="text-slate-500">Here's a look at your clinic's status today.</p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0 items-center">
                 <div className="flex items-center gap-2 font-semibold bg-white text-primary py-2 px-4 rounded-full shadow-sm border border-slate-200">
                    <i className="fas fa-clock"></i>
                    <span>{time.toLocaleTimeString()}</span>
                </div>
                {canCast && (
                     <button onClick={handleCast} className="p-2 w-10 h-10 bg-white hover:bg-slate-100 text-slate-700 rounded-full font-medium text-sm shadow-sm border border-slate-200" title="Cast to TV">
                        <i className="fas fa-tv"></i>
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;