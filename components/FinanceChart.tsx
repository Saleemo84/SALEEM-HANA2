
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
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
                    <YAxis 
                        tickFormatter={(value) => new Intl.NumberFormat('en-US').format(value as number)}
                        tick={{ fill: '#64748b' }}
                        width={100}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip 
                        formatter={(value) => `${(value as number).toLocaleString()} IQD`}
                        cursor={{fill: 'rgba(139, 92, 246, 0.1)'}}
                        contentStyle={{
                            background: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '0.5rem',
                        }}
                    />
                    <Legend iconType="circle" />
                    <Bar dataKey="income" fill="#8b5cf6" name="Income (IQD)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenditure" fill="#ef4444" name="Expenditure (IQD)" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default FinanceChart;