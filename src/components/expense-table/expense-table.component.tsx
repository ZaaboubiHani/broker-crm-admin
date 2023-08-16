import React from 'react';
import './expense-table.style.css';

interface ExpenseTableProps {
    data: any[];
}

const ExpenseTable: React.FC<ExpenseTableProps> = ({ data }) => {
    return (
        <div className='table-container'>

            <table className="table">
                <thead>
                    <tr>
                        <th key='0'>Date</th>
                        <th key='1'>Localité départ</th>
                        <th key='2'>Arrivé</th>
                        <th key='3'>Total contact médcins</th>
                        <th key='4'>Total contact pharmacies</th>
                        <th key='5'>Total KM</th>
                        <th key='6'>Indemnités KM</th>
                        <th key='7'>Total nuites</th>
                        <th key='8'>Indemnités nuites</th>
                        <th key='9'>Total des indemnités</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            <td key='0'>{row['date']}</td>
                            <td key='1'>{row['departLocation']}</td>
                            <td key='2'>{row['arrival']}</td>
                            <td key='3'>{row['totalMed']}</td>
                            <td key='4'>{row['totalPharm']}</td>
                            <td key='5'>{row['totalKm']}</td>
                            <td key='6'>{row['priceKm']}</td>
                            <td key='7'>{row['totalNights']}</td>
                            <td key='8'>{row['priceNight']}</td>
                            <td key='8'>{row['otherExpenses']}</td>
                            <td key='8'>{row['totalPrice']}</td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ExpenseTable;
