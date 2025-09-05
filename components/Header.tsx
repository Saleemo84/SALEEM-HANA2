
import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    return (
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 p-4 bg-white rounded-lg shadow-sm animate-slideDown">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
                <div className="flex items-center gap-2 font-medium">
                    <i className="fas fa-phone text-gray-600"></i>
                    <span>07507816500</span>
                </div>
                <div className="flex items-center gap-2 font-medium bg-primary-light text-primary-dark py-2 px-4 rounded-full">
                    <i className="fas fa-clock"></i>
                    <span>{time.toLocaleTimeString()}</span>
                </div>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
                <button className="py-2 px-4 bg-primary text-white rounded-md font-medium text-sm">EN</button>
                <button className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium text-sm">AR</button>
            </div>
        </header>
    );
};

export default Header;
