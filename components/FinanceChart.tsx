
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Jan', income: 3200000, expenditure: 1800000 },
    { name: 'Feb', income: 2900000, expenditure: 1700000 },
    { name: 'Mar', income: 3500000, expenditure: 1900000 },
    { name: 'Apr', income: 4100000, expenditure: 2100000 },
    { name: 'May', income: 3800000, expenditure: 2000000 },
    { name: 'Jun', income: 4200000, expenditure: 2200000 },
];

const FinanceChart: React.FC = () => {
    return (
        <div className="h-80 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 20, left: 50, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#6B7280' }} />
                    <YAxis 
                        tickFormatter={(value) => new Intl.NumberFormat('en-US').format(value as number)}
                        tick={{ fill: '#6B7280' }}
                        width={100}
                    />
                    <Tooltip 
                        formatter={(value) => `${(value as number).toLocaleString()} IQD`}
                        cursor={{fill: 'rgba(239, 246, 255, 0.5)'}}
                    />
                    <Legend />
                    <Bar dataKey="income" fill="#1976D2" name="Income (IQD)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenditure" fill="#F44336" name="Expenditure (IQD)" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default FinanceChart;
