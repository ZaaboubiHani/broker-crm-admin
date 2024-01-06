import React from "react";
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from "@mui/material/DialogContent";
import { Card, CardActionArea, CardMedia, DialogActions } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { formatDateToYYYYMMDD, calculateDaysBetweenDates } from "../../functions/date-format";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import ExpenseService from '../../services/expense.service';
import ExpenseModel from '../../models/expense.model';
import dayjs, { Dayjs } from "dayjs";
import DotSpinner from "@uiball/loaders/dist/components/DotSpinner";
import SearchIcon from '@mui/icons-material/Search';

interface ExpenseStatsDialogProps {
    isOpen: boolean,
    userId: number | undefined,
    onClose: (value: string) => void;
}

const ExpenseStatsDialog: React.FC<ExpenseStatsDialogProps> = ({ onClose, isOpen, userId }) => {

    const handleClose = () => {
        onClose('selectedValue');
    };

    const handleFetchStats = async () => {
        if (startDate && endDate && userId && !isLoading) {
            setIsLoading(true);
            let expenses = await expenseService.getAllExpensesOfUserFromTo(startDate, endDate, userId);
            setExpenses(expenses);
            setIsLoading(false);
        }
    };

    const expenseService = ExpenseService.getInstance();

    const [startDate, setStartDate] = React.useState<Date | null | undefined>(undefined);
    const [endDate, setEndDate] = React.useState<Date | null | undefined>(undefined);
    const [expenses, setExpenses] = React.useState<ExpenseModel[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>();

    React.useEffect(() => {
        const initData = () => {
            try {
                setExpenses([]);
                setStartDate(undefined);
                setEndDate(undefined);
                setIsLoading(false);
            } catch (error) {
                console.error('Error init data:', error);
            }
        };
        initData();
    }, [isOpen]);


    return (
        <Dialog fullWidth={true} maxWidth='md' onClose={handleClose} open={isOpen} >
            <DialogTitle sx={{ fontSize: '15px' }}>sélectionner la date de début et la date de fin, puis cliquer sur le bouton de recherche (la date de fin est exclue)</DialogTitle>
            <DialogContent>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker onChange={(date) => {
                            setStartDate(new Date(date!.toString()));
                        }} label="de" />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker onChange={(date) => {

                            setEndDate(new Date(date!.toString()));
                        }} label="à" />
                    </LocalizationProvider>
                    <button onClick={handleFetchStats} className="btn btn-primary" style={{ backgroundColor: '#fff', border: '#ddd solid 1px', height: '55px', width: '55px' }}>
                        <div style={{
                            position: 'absolute',
                            top: '74px',
                            right: '194px',
                            opacity: isLoading ? '1' : '0',
                            transition: 'all 500ms ease'
                        }}>
                            <DotSpinner
                                size={20}
                                speed={0.9}
                                color="black"

                            />
                        </div>
                        <SearchIcon sx={{
                            color: 'black',
                            position: 'absolute',
                            top: '75px',
                            right: '195px',
                            opacity: isLoading ? '0' : '1',
                            transition: 'all 500ms ease'
                        }} />
                    </button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                    <h6 style={{ fontSize: '16px', }}>
                        Nombre de jours : {calculateDaysBetweenDates(startDate, endDate)}
                    </h6>
                    <h6 style={{ fontSize: '15px', }}>
                        Total Km : {expenses.map((e) => e.kmTotal || 0).reduce((sum, current) => sum + current, 0)}
                    </h6>
                    <h6 style={{ fontSize: '15px', }}>
                        Total nuitées :  {expenses.map((e) => e.nightsTotal || 0).reduce((sum, current) => sum + current, 0)}
                    </h6>
                    <h6 style={{ fontSize: '15px', }}>
                        Total autre frais : {expenses.map((e) => e.otherExpenses || 0).reduce((sum, current) => sum + current, 0).toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' }) ?? (0).toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' })}
                    </h6>
                    <h6 style={{ fontSize: '15px', }}>
                        Total note de frais : {expenses.map((e) => e.totalExpense || 0).reduce((sum, current) => sum + current, 0).toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' }) ?? (0).toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' })}
                    </h6>
                </div>
            </DialogContent>
            <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button onClick={handleClose} variant="contained" disableElevation>
                    <CloseIcon />
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ExpenseStatsDialog;