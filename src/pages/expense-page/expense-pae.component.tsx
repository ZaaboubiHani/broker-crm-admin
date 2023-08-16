import React, { Component } from 'react';
import '../expense-page/expense-page.style.css';
import MonthYearPicker from '../../components/month-year-picker/month-year-picker.component';
import SearchBar from '../../components/search-bar/search-bar.component';
import ExpenseTable from '../../components/expense-table/expense-table.component';
import Button from '../../components/button/button.component';



interface ExpensePageProps {
    date: Date,
}


const data = [
    { date: '23/02/2023', departLocation: 'walid kadri', arrival: 'BATNA', totalMed: 5, totalPharm: 2, totalKm: 130, priceKm: 500, totalNights: 3, priceNight: 5000, otherExpenses: 7000,totalPrice: 5000 },
];

class ExpensePage extends Component<{}, ExpensePageProps> {
    constructor({ }) {
        super({});
    }

    render() {
        return (
            <div className='expense'>
                <div className='header'>
                    <MonthYearPicker onPick={(date) => {
                        console.log(date);
                    }}></MonthYearPicker>
                    <SearchBar onClick={()=>{}}></SearchBar>
                </div>
              <ExpenseTable data={data}></ExpenseTable>
              <Button onClick={()=>{}} text='Consulter pièces jointes' backgroundColor='#3D7C98' ></Button>

            </div>
        );
    }
}

export default ExpensePage;
