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

interface ProfilePageProps {

}

interface ProfilePageState {
    users: User[];
    currentUser: User;
    loadingUsers: boolean;
    isLoading: boolean;
    addClientDialogIsOpen: boolean,
}



class ProfilePage extends Component<ProfilePageProps, ProfilePageState> {

    constructor() {
        super({});
        this.state = {
            isLoading: true,
            currentUser: new UserModel(),
            users: [],
            loadingUsers: true,
            addClientDialogIsOpen: false
        };
    }

    userService = new UserService();


    handleSaveChanges = async () => {
        this.setState({ addClientDialogIsOpen: false, loadingUsers: true });
        for (var i = 0; i < this.state.users.length; i++) {
            await this.userService.updateUser(this.state.users[i]);
        }
        var users = await this.userService.getAllUsers();
        this.setState({ users: users, loadingUsers: false });
    }

    handleAddUser = async (user: User) => {
        this.setState({ addClientDialogIsOpen: false, loadingUsers: true });
        await this.userService.addUser(user);

        var users = await this.userService.getAllUsers();
        this.setState({ users: users, loadingUsers: false });
    }

    handleOpenAddClientDialog = () => {
        this.setState({ addClientDialogIsOpen: true });
    }

    handleCloseAddClientDialog = () => {
        this.setState({ addClientDialogIsOpen: false });
    }

    loadProfilePageData = async () => {
        this.setState({ addClientDialogIsOpen: false, isLoading: false });
        var me = await this.userService.getMe();
        var users = await this.userService.getAllUsers();
        this.setState({ users: users, loadingUsers: false });
        this.setState({ isLoading: false, currentUser: me });
    }

    render() {
        if (this.state.isLoading) {
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
                    <div style={{height:'125px'}}>
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
                            <h4 onClick={this.handleOpenAddClientDialog}>Ajouter un délégué</h4>
                            <Button onClick={this.handleSaveChanges} startIcon={<SaveIcon />} sx={{ marginLeft: '16px' }} variant="outlined">Enregistrer les modifications</Button>
                        </div>
                    </div>
                    <div style={{ width: '100%', display: 'flex', flexGrow: '1', justifyContent: 'stretch' }}>
                        {
                            this.state.loadingUsers ? <DotSpinner
                                size={40}
                                speed={0.9}
                                color="black"
                            /> :
                                <ProfileTable isLoading={false} data={this.state.users} />}
                    </div>
                    <AddClientDialog onAdd={this.handleAddUser} isOpen={this.state.addClientDialogIsOpen} onClose={this.handleCloseAddClientDialog}></AddClientDialog>
                </div>
            );
        }
    }
}

export default ProfilePage;
