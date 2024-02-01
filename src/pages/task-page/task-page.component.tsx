import React, { Component } from 'react';
import '../task-page/task-page.style.css';
import UserService from '../../services/user.service';
import UserModel, { UserType } from '../../models/user.model';
import { DotSpinner } from '@uiball/loaders'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import CustomTabPanel from '../../components/custom-tab-panel/costum-tab-panel.component';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import UserDropdown from '../../components/user-dropdown/user-dropdown';
import TodoService from '../../services/todo.service';
import TodoModel from '../../models/todo.model';
import TodoTable from '../../components/todo-table/todo-table.component';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import AddTaskIcon from '@mui/icons-material/AddTask';
import Button from '@mui/material/Button';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs, { Dayjs } from 'dayjs';
import Snackbar from '@mui/material/Snackbar';

interface TaskPageState {
    isLoading: boolean;
    index: number;
    currentUser: UserModel;
    supervisors: UserModel[];
    delegates: UserModel[];
    kams: UserModel[];
    delegateTodos: TodoModel[];
    kamTodos: TodoModel[];
    selectedSupervisor?: UserModel;
    selectedDelegate?: UserModel;
    selectedKam?: UserModel;
    loadingDelegates: boolean;
    loadingTodos: boolean;
    delegateTotal: number;
    delegatePage: number;
    delegateSize: number;
    todo: TodoModel;
    showSnackbar: boolean;
    snackbarMessage: string;
}

class TaskPage extends Component<{}, TaskPageState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            currentUser: new UserModel(),
            index: 0,
            isLoading: true,
            delegates: [],
            supervisors: [],
            kams: [],
            loadingDelegates: false,
            delegateTodos: [],
            kamTodos: [],
            loadingTodos: false,
            delegatePage: 1,
            delegateTotal: 0,
            delegateSize: 100,
            todo: new TodoModel({ startDate: undefined }),
            showSnackbar: false,
            snackbarMessage: '',
        }
    }

    userService = UserService.getInstance();
    todoService = TodoService.getInstance();


    loadTaskPageData = async () => {

        var currentUser = await this.userService.getMe();

        if (currentUser != undefined) {
            this.setState({ currentUser: currentUser });
        }

        if (currentUser.type === UserType.supervisor) {

            var delegates = await this.userService.getUsersByCreator(currentUser.id!, UserType.delegate);

            this.setState({
                currentUser: currentUser,
                isLoading: false,
                delegates: delegates,
            });

        } else if (currentUser.type === UserType.admin) {
            var supervisors = await this.userService.getUsersByCreator(currentUser.id!, UserType.supervisor);

            this.setState({
                supervisors: supervisors,
                currentUser: currentUser,
                isLoading: false,

            });
        }

        this.setState({
            isLoading: false,
        });
    };

    handleSelectSupervisor = async (supervisor?: UserModel) => {
        this.setState({
            selectedSupervisor: supervisor,
            loadingDelegates: true,
            selectedDelegate: undefined,
            delegateTodos: [],
            delegatePage: 1
        });

        var delegates = await this.userService.getUsersByCreator(supervisor!.id!, UserType.delegate);
        this.setState({
            selectedSupervisor: supervisor,
            loadingDelegates: false,
            delegates: delegates,
        });
    }

    handleSelectDelegate = async (delegate?: UserModel) => {
        this.setState({
            selectedDelegate: delegate,
            loadingDelegates: true,
            loadingTodos: true,
            delegatePage: 1
        });
        var { todos, total } = await this.todoService.getAllTodosOfDelegate(delegate!.id!, 1, this.state.delegateSize);
        this.setState({
            loadingDelegates: false,
            loadingTodos: false,
            delegateTodos: todos,
            delegateTotal: total,
        });
    }

    handleDelegatePageChange = async (page: number, size: number) => {
        this.setState({
            delegatePage: page,
            delegateSize: size,
            loadingDelegates: true,
            loadingTodos: true,
        });

        if (this.state.selectedDelegate) {
            var { todos, total } = await this.todoService.getAllTodosOfDelegate(this.state.selectedDelegate!.id!, page, size);
            this.setState({
                delegateTodos: todos,
                delegateTotal: total,
            });
        }
        this.setState({
            loadingDelegates: false,
            loadingTodos: false,
        });
    }

    handleCreateTodo = async () => {
        this.setState({
            loadingTodos: true,
        });
        if (!this.state.todo.action) {
            this.setState({
                showSnackbar: true,
                snackbarMessage: 'champ Action requis',
            })
        }
        else if (!this.state.todo.task) {
            this.setState({
                showSnackbar: true,
                snackbarMessage: 'champ Tâche requis',
            })
        }
        else if (!this.state.todo.region) {
            this.setState({
                showSnackbar: true,
                snackbarMessage: 'champ Région requis',
            })
        }
        else if (!this.state.todo.remark) {
            this.setState({
                showSnackbar: true,
                snackbarMessage: 'champ Remarque requis',
            })
        } else if (!this.state.todo.startDate) {
            this.setState({
                showSnackbar: true,
                snackbarMessage: 'champ Date de début requis',
            })
        } else if (!this.state.todo.endDate) {
            this.setState({
                showSnackbar: true,
                snackbarMessage: 'champ Date de fin requis',
            })
        }
        else {
            this.state.todo.delegate = this.state.selectedDelegate;
            await this.todoService.createTodo(this.state.todo);
            var { todos, total } = await this.todoService.getAllTodosOfDelegate(this.state.selectedDelegate!.id!, this.state.delegatePage, this.state.delegateSize);
            this.setState({
                delegateTodos: todos,
                delegateTotal: total,
                todo: new TodoModel({
                }),
            });
        }
        this.setState({
            loadingTodos: false,
           
        });
    }
    handleCloseSanckbar = (event: React.SyntheticEvent | Event, reason?: string) => {
        this.setState({ showSnackbar: false });
    };

    componentDidMount(): void {
        if (localStorage.getItem('isLogged') === 'true') {
            this.loadTaskPageData();
        }
    }

    handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        this.setState({ index: newValue, });
    };

    render() {
        if (this.state.isLoading) {
            return (
                <div style={{
                    width: '100%',
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <DotSpinner
                        size={40}
                        speed={0.9}
                        color="black"
                    />
                </div>
            );
        }
        else {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', backgroundColor: '#eee' }}>
                    <Box sx={{ width: '100%', height: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={this.state.index} onChange={this.handleTabChange} aria-label="basic tabs example">
                                <Tab label="Superviseurs" />
                                {
                                    // this.state.currentUser.type !== UserType.supervisor ? (<Tab label="Kams" />) : null
                                }
                            </Tabs>
                        </Box>
                        <CustomTabPanel value={this.state.index} index={0} >
                            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: '1', height: 'calc(100vh  - 65px)', width: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'stretch', flexGrow: '1', marginTop: '8px', marginBottom: '8px' }}>
                                    {
                                        this.state.currentUser.type === UserType.admin ?
                                            (<div style={{ height: '50px', width: '150px', marginRight: '8px' }}>
                                                <UserDropdown
                                                    users={this.state.supervisors}
                                                    selectedUser={this.state.selectedSupervisor}
                                                    onSelectUser={this.handleSelectSupervisor}
                                                    label='Superviseur'
                                                />
                                            </div>) : null
                                    }
                                    <div style={{ height: '50px', width: '150px', }}>
                                        <UserDropdown
                                            users={this.state.delegates}
                                            selectedUser={this.state.selectedDelegate}
                                            onSelectUser={this.handleSelectDelegate}
                                            label='Délégué'
                                            loading={this.state.loadingDelegates}
                                        />
                                    </div>
                                </div>
                                <div style={{
                                    width: '100%',
                                    flexGrow: '1',
                                    display: 'flex',
                                    height: 'calc(100% - 50px)'
                                }}>
                                    <TodoTable
                                        id='todo-table'
                                        data={this.state.delegateTodos}
                                        isLoading={this.state.loadingTodos}
                                        page={this.state.delegatePage}
                                        size={this.state.delegateSize}
                                        total={this.state.delegateTotal}
                                        pageChange={this.handleDelegatePageChange}
                                    ></TodoTable>
                                    <div
                                        style={{
                                            width: '30%',
                                            backgroundColor: 'rgba(255,255,255,0.5)',
                                            margin: '0px 0px 8px',
                                            borderRadius: '4px',
                                            border: '1px solid rgba(127,127,127,0.2)',
                                            padding: '8px',
                                        }}>
                                        <TextField
                                            id={this.state.todo.action}
                                            sx={{ margin: '8px', width: 'calc(100% - 16px)' }}
                                            disabled={this.state.selectedDelegate === undefined}
                                            size='small' label="Action" variant="outlined"
                                            value={this.state.todo.action}
                                            onChange={(event) => {
                                                this.state.todo.action = event.target.value;
                                            }} />
                                        <TextField
                                            id={this.state.todo.task}
                                            sx={{ margin: '8px', width: 'calc(100% - 16px)' }}
                                            disabled={this.state.selectedDelegate === undefined}
                                            size='small' label="Tâche" variant="outlined"
                                            value={this.state.todo.task}
                                            onChange={(event) => {
                                                this.state.todo.task = event.target.value;
                                            }} />
                                        <TextField
                                            id={this.state.todo.region}
                                            sx={{ margin: '8px', width: 'calc(100% - 16px)' }}
                                            disabled={this.state.selectedDelegate === undefined}
                                            size='small' label="Région" variant="outlined"
                                            value={this.state.todo.region}
                                            onChange={(event) => {
                                                this.state.todo.region = event.target.value;
                                            }} />
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                sx={{
                                                    margin: '8px',
                                                    width: 'calc(100% - 16px)',
                                                }}
                                                disabled={this.state.selectedDelegate === undefined}
                                                slotProps={{
                                                    field: {
                                                        id: this.state.todo.remark
                                                    }
                                                }}
                                                onChange={(date) => {
                                                    this.state.todo.startDate = new Date(date!.toString());
                                                }} label="Date de début" />
                                        </LocalizationProvider>
                                        <LocalizationProvider
                                            dateAdapter={AdapterDayjs}>
                                            <DatePicker

                                                sx={{
                                                    margin: '8px',
                                                    width: 'calc(100% - 16px)',
                                                }}
                                                disabled={this.state.selectedDelegate === undefined}

                                                onChange={(date) => {
                                                    this.state.todo.endDate = new Date(date!.toString());
                                                }} label="Date de fin" />
                                        </LocalizationProvider>
                                        <TextField
                                            id={this.state.todo.remark}
                                            disabled={this.state.selectedDelegate === undefined}
                                            sx={{ margin: '8px', width: 'calc(100% - 16px)' }}
                                            label="Remarque"
                                            size='small'
                                            multiline
                                            maxRows={4}
                                            value={this.state.todo.remark}
                                            onChange={(event) => {
                                                this.state.todo.remark = event.target.value;
                                            }}
                                        />
                                        <Button variant="outlined"
                                            disabled={this.state.selectedDelegate === undefined}
                                            sx={{ margin: '8px' }}
                                            onClick={this.handleCreateTodo}
                                        >
                                            <AddTaskIcon style={{ marginRight: '8px' }} /> Ajouter une tâche
                                        </Button>
                                    </div>
                                </div>
                                <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} onClose={this.handleCloseSanckbar} open={this.state.showSnackbar} autoHideDuration={3000} message={this.state.snackbarMessage} />
                            </div>
                        </CustomTabPanel>
                        <CustomTabPanel value={this.state.index} index={1} >
                            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: '1', height: 'calc(100vh  - 65px)', width: '100%', }}>
                                <div className='table-panel'>
                                    <div style={{
                                        width: '30%',
                                        backgroundColor: 'rgba(255,255,255,0.5)',
                                        margin: '0px 0px 8px',
                                        borderRadius: '4px',
                                        border: '1px solid rgba(127,127,127,0.2)'
                                    }}>
                                    </div>
                                </div>
                            </div>
                        </CustomTabPanel>
                    </Box>
                </div>
            );
        }
    }
}



export default TaskPage;

