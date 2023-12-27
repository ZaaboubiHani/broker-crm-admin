import React, { Component } from 'react';

import CircleAvatar from '../../components/circle-avatar/circle-avatar.component';
import UserDetails from '../../components/user-details/user-details.component';
import UserModel, { UserType } from '../../models/user.model';
import '../profile-page/profile-page.style.css';
import UserService from '../../services/user.service';
import UserDialog from '../../components/user-dialog/user-dialog.component';
import DotSpinner from '@uiball/loaders/dist/components/DotSpinner';
import ProfileTable from '../../components/profile-table/profile-table.component';
import Button from '@mui/material/Button/Button';
import SaveIcon from '@mui/icons-material/Save';
import WilayaModel from '../../models/wilaya.model';
import WilayaService from '../../services/wilaya.serivce';
import Snackbar from '@mui/material/Snackbar';

interface ProfilePageProps {

}

interface ProfilePageState {
    users: UserModel[];
    wilayas: WilayaModel[],
    currentUser: UserModel;
    selectedUser?: UserModel;
    loadingUsers: boolean;
    showSnackbar: boolean;
    isLoading: boolean;
    snackbarMessage: string;
    clientDialogIsOpen: boolean,
}



class ProfilePage extends Component<ProfilePageProps, ProfilePageState> {

    constructor() {
        super({});
        this.state = {
            isLoading: true,
            showSnackbar: false,
            snackbarMessage: '',
            currentUser: new UserModel(),
            users: [],
            wilayas: [],
            loadingUsers: true,
            clientDialogIsOpen: false
        };
    }

    userService = UserService.getInstance();
    wilayaService = WilayaService.getInstance();


    handleSaveChanges = async () => {
        if (this.state.users.some((u) => u.password !== undefined && u.password.length < 8 && u.password.length > 0)) {
            this.setState({ showSnackbar: true, snackbarMessage: 'le mot de passe doit comporter au moins 8 caractères' })
        } else {
            this.setState({ clientDialogIsOpen: false, loadingUsers: true });
            for (var i = 0; i < this.state.users.length; i++) {
                await this.userService.updateUser(this.state.users[i]);
            }
            this.setState({ showSnackbar: true, snackbarMessage: 'Données enregistrées' });
            if (this.state.currentUser.type === UserType.supervisor) {
                var users = await this.userService.getUsersByCreator(this.state.currentUser.id!, UserType.delegate,);
                this.setState({ users: users, loadingUsers: false, });
            } else {
                var users = await this.userService.getUsersByCreator(this.state.currentUser.id!, UserType.admin,);
                this.setState({ users: users, loadingUsers: false, });
            }
        }
    }

    handleAddUser = async (user: UserModel) => {
        this.setState({ clientDialogIsOpen: false, loadingUsers: true, });
        await this.userService.addUser(user);
        if (this.state.currentUser.type === UserType.supervisor) {
            var users = await this.userService.getUsersByCreator(this.state.currentUser.id!, UserType.delegate,);
            this.setState({ users: users, loadingUsers: false, });
        } else {
            var users = await this.userService.getUsersByCreator(this.state.currentUser.id!, UserType.admin,);
            this.setState({ users: users, loadingUsers: false, });
        }
    }

    handleEditUser = async (user: UserModel) => {
        this.setState({ clientDialogIsOpen: false, loadingUsers: true, });
        await this.userService.updateUser(user);
        if (this.state.currentUser.type === UserType.supervisor) {
            var users = await this.userService.getUsersByCreator(this.state.currentUser.id!, UserType.delegate,);
            this.setState({ users: users, loadingUsers: false, });
        } else {
            var users = await this.userService.getUsersByCreator(this.state.currentUser.id!, UserType.admin,);
            this.setState({ users: users, loadingUsers: false, });
        }
    }

    handleOpenAddClientDialog = () => {
        this.setState({ clientDialogIsOpen: true, selectedUser: undefined });
    }

    handleCloseAddClientDialog = () => {
        this.setState({ clientDialogIsOpen: false, selectedUser: undefined });
    }

    loadProfilePageData = async () => {
        var currentUser = await this.userService.getMe();
        if (currentUser.type === UserType.supervisor) {
            var users = await this.userService.getUsersByCreator(currentUser.id!, UserType.delegate,);
            var wilayas = await this.wilayaService.getAllWilayasFromServer();
            this.setState({ users: users, loadingUsers: false, isLoading: false, currentUser: currentUser, wilayas: wilayas, });
        } else {
            var users = await this.userService.getUsersByCreator(currentUser.id!, UserType.admin,);
            var wilayas = await this.wilayaService.getAllWilayasFromServer();
            this.setState({ users: users, loadingUsers: false, isLoading: false, currentUser: currentUser, wilayas: wilayas, });
        }
    }

    handleCloseSanckbar = (event: React.SyntheticEvent | Event, reason?: string) => {
        this.setState({ showSnackbar: false });
    };

    handleShowUserDialog = (user: UserModel) => {
        this.setState({ clientDialogIsOpen: true, selectedUser: user });
    };

    componentDidMount(): void {
        if (localStorage.getItem('isLogged') === 'true') {
            this.loadProfilePageData();
        }
    }

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
                <div className='profile' style={{ overflow: 'hidden' }}>
                    <div style={{ height: '125px' }}>
                        <CircleAvatar name='KW'></CircleAvatar>
                        <UserDetails
                            name={this.state.currentUser.username ?? ''}
                            company={this.state.currentUser.company?.name ?? ''}
                            supervisor={this.state.currentUser.type === UserType.delegate ? 'sup' : undefined}
                            email={this.state.currentUser.email ?? ''}
                            phone={this.state.currentUser.phoneOne ?? ''}
                        ></UserDetails>
                    </div>
                    <div className='title'>
                        <h3>Information d'équipe :</h3>
                        <div style={{ display: 'flex', alignItems: 'end' }}>
                            <h4 onClick={this.handleOpenAddClientDialog}>{this.state.currentUser.type === UserType.admin ? 'Ajouter superviseur/kam' : 'Ajouter un délégué'}</h4>
                            <Button onClick={this.handleSaveChanges} startIcon={<SaveIcon />} sx={{ marginLeft: '16px' }} variant="outlined">Enregistrer les modifications</Button>
                        </div>
                    </div>
                    <div style={{
                        width: '100%',
                        display: 'flex',
                        flex: '1',
                        justifyContent: 'stretch',
                        height: '150px'
                    }}>
                        {this.state.loadingUsers ? <div style={{
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
                        </div> :
                            <div style={{
                                width: '100%',
                                display: 'flex',
                                flexGrow: '1',
                                flex: '1',
                                paddingBottom: '16px',
                            }}>
                                <ProfileTable
                                    isLoading={false}
                                    data={this.state.users}
                                    wilayas={this.state.wilayas}
                                    editUser={this.handleShowUserDialog}
                                />
                            </div>
                        }
                    </div>
                    <UserDialog
                        wilayas={this.state.wilayas}
                        onAdd={this.handleAddUser}
                        onEdit={this.handleEditUser}
                        isOpen={this.state.clientDialogIsOpen}
                        onClose={this.handleCloseAddClientDialog}
                        initUser={this.state.selectedUser}
                        creatorType={this.state.currentUser.type!}
                    ></UserDialog>
                    <Snackbar
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                        onClose={this.handleCloseSanckbar}
                        open={this.state.showSnackbar}
                        autoHideDuration={3000}
                        message={this.state.snackbarMessage} />
                </div>
            );
        }
    }
}

export default ProfilePage;
