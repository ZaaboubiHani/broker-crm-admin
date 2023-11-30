import React, { Component } from 'react';

import CircleAvatar from '../../components/circle-avatar/circle-avatar.component';
import UserDetails from '../../components/user-details/user-details.component';
import User, { UserType } from '../../models/user.model';
import '../profile-page/profile-page.style.css';
import UserService from '../../services/user.service';
import AddClientDialog from '../../components/add-client-dialog/add-client-dialog.component';
import UserModel from '../../models/user.model';
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
    users: User[];
    wilayas: WilayaModel[],
    currentUser: User;
    loadingUsers: boolean;
    showSnackbar: boolean;
    isLoading: boolean;
    hasData: boolean;
    snackbarMessage: string;
    addClientDialogIsOpen: boolean,
    totalUser: number,
    sizeUser: number,
    userPage: number,
}



class ProfilePage extends Component<ProfilePageProps, ProfilePageState> {

    constructor() {
        super({});
        this.state = {
            isLoading: false,
            hasData: false,
            showSnackbar: false,
            snackbarMessage: '',
            currentUser: new UserModel(),
            users: [],
            wilayas: [],
            loadingUsers: true,
            addClientDialogIsOpen: false,
            totalUser: 0,
            sizeUser: 25,
            userPage: 1,
        };
    }

    userService = new UserService();
    wilayaService = new WilayaService();


    handleSaveChanges = async () => {
        if (this.state.users.some((u) => u.password !== undefined && u.password.length < 8 && u.password.length > 0)) {
            this.setState({ showSnackbar: true, snackbarMessage: 'le mot de passe doit comporter au moins 8 caractères' })
        } else {
            this.setState({ addClientDialogIsOpen: false, loadingUsers: true });
            for (var i = 0; i < this.state.users.length; i++) {
                await this.userService.updateUser(this.state.users[i]);
            }
            this.setState({ showSnackbar: true, snackbarMessage: 'Données enregistrées' });
            var users = await this.userService.getUsersByCreator(this.state.currentUser.id!, UserType.admin);
            this.setState({ users: users, loadingUsers: false, });
        }
    }

    handleAddUser = async (user: User) => {
        this.setState({ addClientDialogIsOpen: false, loadingUsers: true });
        await this.userService.addUser(user);

        var users = await this.userService.getUsersByCreator(this.state.currentUser.id!, UserType.admin);
        this.setState({ users: users, loadingUsers: false, });
    }

    handleOpenAddClientDialog = () => {
        this.setState({ addClientDialogIsOpen: true });
    }

    handleCloseAddClientDialog = () => {
        this.setState({ addClientDialogIsOpen: false });
    }

    loadProfilePageData = async () => {
        this.setState({ isLoading: true });
        if (!this.state.isLoading) {
            var currentUser = await this.userService.getMe();
            var users = await this.userService.getUsersByCreator(currentUser.id!, UserType.admin);
            var wilayas = await this.wilayaService.getAllWilayasFromServer();
            this.setState({ users: users, loadingUsers: false, });
            this.setState({ isLoading: false, currentUser: currentUser, wilayas: wilayas, hasData: true });
        }
    }

    handleCloseSanckbar = (event: React.SyntheticEvent | Event, reason?: string) => {
        this.setState({ showSnackbar: false });
    };

    handleUserPageChange = async (page: number) => {
        this.setState({ loadingUsers: true, userPage: page });
        var users = await this.userService.getUsersByCreator(this.state.currentUser.id!, UserType.admin, page, this.state.sizeUser);
        this.setState({ users: users, loadingUsers: false, userPage: page, });
    }

    handleUserRowNumChange = async (size: number) => {
        this.setState({ loadingUsers: true, userPage: 1, sizeUser: size });
        var users = await this.userService.getUsersByCreator(this.state.currentUser.id!, UserType.admin, 1, size);
        this.setState({ users: users, loadingUsers: false, userPage: 1, sizeUser: size, });
    }

    render() {
        if (!this.state.hasData) {
            this.loadProfilePageData();
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
                            <h4 onClick={this.handleOpenAddClientDialog}>{this.state.currentUser.type === UserType.admin ? 'Ajouter spervisor/kam' : 'Ajouter un délégué'}</h4>
                            <Button onClick={this.handleSaveChanges} startIcon={<SaveIcon />} sx={{ marginLeft: '16px' }} variant="outlined">Enregistrer les modifications</Button>
                        </div>
                    </div>
                    <div style={{ width: '100%', display: 'flex', flexGrow: '1', justifyContent: 'stretch', height: '150px' }}>
                        {
                            this.state.loadingUsers ? <div style={{
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
                                <ProfileTable
                                    isLoading={false}
                                    data={this.state.users}
                                    wilayas={this.state.wilayas}
                                    total={this.state.totalUser}
                                    page={this.state.userPage}
                                    size={this.state.sizeUser}
                                    pageChange={this.handleUserPageChange}
                                    rowNumChange={this.handleUserRowNumChange}
                                />}
                    </div>
                    <AddClientDialog
                        wilayas={this.state.wilayas}
                        onAdd={this.handleAddUser}
                        isOpen={this.state.addClientDialogIsOpen}
                        onClose={this.handleCloseAddClientDialog}
                        creatorType={this.state.currentUser.type!}
                    ></AddClientDialog>
                    <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} onClose={this.handleCloseSanckbar} open={this.state.showSnackbar} autoHideDuration={3000} message={this.state.snackbarMessage} />
                </div>
            );
        }
    }
}

export default ProfilePage;
