import React from 'react';

const StatCard = ({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) => {
    return (
        <div className="bg-gray-800 text-white shadow-md md:min-h-[120px] rounded-lg p-6 flex items-center relative transition-transform duration-300 hover:scale-105">
            <div className="bg-blue-500 text-white rounded-full p-3">
                {icon}
            </div>
            <div className="ml-4">
                <h4 className="text-gray-300 text-sm">{title}</h4>
                <p className="text-white text-2xl font-semibold">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;
