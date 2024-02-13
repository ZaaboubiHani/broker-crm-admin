import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Button from '@mui/material/Button';
import AddTaskIcon from '@mui/icons-material/AddTask';
import TodoModel from '../../models/todo.model';

interface TaskPanelProps {
    disabled: boolean;
    onCreateTodo: (todo: TodoModel) => void;
}

const TaskPanel: React.FC<TaskPanelProps> = ({ disabled, onCreateTodo }) => {

    const [action, setAction] = React.useState('');
    const [task, setTask] = React.useState('');
    const [region, setRegion] = React.useState('');
    const [remark, setRemark] = React.useState('');
    const [startDate, setStartDate] = React.useState<Date | null>(null);
    const [endDate, setEndDate] = React.useState<Date | null>(null);

    return (
        <div
            style={{
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                height: 'calc(100% - 16px)',
                backgroundColor: 'rgba(255,255,255,0.5)',
                borderRadius: '4px',
                border: '1px solid rgba(127,127,127,0.2)',
                padding: '8px'
            }}>
            <LocalizationProvider
                dateAdapter={AdapterDayjs}>
                <DateTimePicker
                    sx={{
                        margin: '8px',
                        width: 'calc(100% - 16px)',
                    }}
                    disabled={disabled}
                    views={['year', 'month', 'day', 'hours', 'minutes']}
                    value={startDate}
                    onChange={(date) => {
                        setStartDate(new Date(date!.toString()));
                    }} label="Date de début"
                />
            </LocalizationProvider>
            <LocalizationProvider
                dateAdapter={AdapterDayjs}>
                <DateTimePicker
                    sx={{
                        margin: '8px',
                        width: 'calc(100% - 16px)',
                    }}
                    disabled={disabled}
                    views={['year', 'month', 'day', 'hours', 'minutes']}
                    value={endDate}
                    onChange={(date) => {
                        setEndDate(new Date(date!.toString()));
                    }} label="Date de fin"
                />
            </LocalizationProvider>
            <TextField
                id={action}
                sx={{ margin: '8px', width: 'calc(100% - 16px)' }}
                disabled={disabled}
                size='small' label="Action" variant="outlined"
                value={action}
                onChange={(event) => {
                    setAction(event.target.value);
                }} />
            <TextField
                id={task}
                sx={{ margin: '8px', width: 'calc(100% - 16px)' }}
                disabled={disabled}
                size='small' label="Tâche" variant="outlined"
                value={task}
                onChange={(event) => {
                    setTask(event.target.value);
                }} />
            <TextField
                id={region}
                sx={{ margin: '8px', width: 'calc(100% - 16px)' }}
                disabled={disabled}
                size='small' label="Région" variant="outlined"
                value={region}
                onChange={(event) => {
                    setRegion(event.target.value);
                }} />


            <TextField
                id={remark}
                disabled={disabled}
                sx={{ margin: '8px', width: 'calc(100% - 16px)' }}
                label="Remarque"
                size='small'
                multiline
                maxRows={4}
                value={remark}
                onChange={(event) => {
                    setRemark(event.target.value);
                }}
            />
            <div>
                <Button variant="contained"
                    disabled={action === '' || task === '' || region === '' || remark === '' || startDate === null || endDate === null}
                    sx={{ margin: '8px' }}
                    onClick={() => {
                        let todo = new TodoModel({
                            action: action,
                            task: task,
                            region: region,
                            startDate: startDate!,
                            endDate: endDate!,
                            remark: remark,
                        });
                        onCreateTodo(todo);
                        setAction('');
                        setTask('');
                        setRegion('');
                        setStartDate(null);
                        setEndDate(null);
                        setRemark('');
                    }}
                >
                    Ajouter une tâche
                    <AddTaskIcon style={{ marginLeft: '8px' }} />
                </Button>
            </div>
        </div>
    );
};

export default TaskPanel;
