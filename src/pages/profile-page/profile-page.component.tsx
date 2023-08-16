import React, { Component } from 'react';
import CircleAvatar from '../../components/circle-avatar/circle-avatar.component';
import UserDetails from '../../components/user-details/user-details.component';
import User from '../../models/user.model';
import ProfileTable from '../../components/profile-table/profile-table.component';
import '../profile-page/profile-page.style.css';

interface ProfilePageProps {
    user: User,
}

const data = [
    { creation: '23/02/2023', name: 'walid kadri', pharmVisits: true, medicalVisits: false, phone: '0698547125', email: 'walid@gmail.com', password: '00000000', wilaya: 'BATNA', isBlocked: false },
    { creation: '23/02/2023', name: 'walid kadri', pharmVisits: true, medicalVisits: false, phone: '0698547125', email: 'walid@gmail.com', password: '00000000', wilaya: 'BATNA', isBlocked: false },
    { creation: '23/02/2023', name: 'walid kadri', pharmVisits: true, medicalVisits: false, phone: '0698547125', email: 'walid@gmail.com', password: '00000000', wilaya: 'BATNA', isBlocked: false },
    { creation: '23/02/2023', name: 'walid kadri', pharmVisits: true, medicalVisits: false, phone: '0698547125', email: 'walid@gmail.com', password: '00000000', wilaya: 'BATNA', isBlocked: false },
    { creation: '23/02/2023', name: 'walid kadri', pharmVisits: true, medicalVisits: false, phone: '0698547125', email: 'walid@gmail.com', password: '00000000', wilaya: 'BATNA', isBlocked: false },
    { creation: '23/02/2023', name: 'walid kadri', pharmVisits: true, medicalVisits: false, phone: '0698547125', email: 'walid@gmail.com', password: '00000000', wilaya: 'BATNA', isBlocked: false },
    { creation: '23/02/2023', name: 'walid kadri', pharmVisits: true, medicalVisits: false, phone: '0698547125', email: 'walid@gmail.com', password: '00000000', wilaya: 'BATNA', isBlocked: false },
    { creation: '23/02/2023', name: 'walid kadri', pharmVisits: true, medicalVisits: false, phone: '0698547125', email: 'walid@gmail.com', password: '00000000', wilaya: 'BATNA', isBlocked: false },
    { creation: '23/02/2023', name: 'walid kadri', pharmVisits: true, medicalVisits: false, phone: '0698547125', email: 'walid@gmail.com', password: '00000000', wilaya: 'BATNA', isBlocked: false },
    { creation: '23/02/2023', name: 'walid kadri', pharmVisits: true, medicalVisits: false, phone: '0698547125', email: 'walid@gmail.com', password: '00000000', wilaya: 'BATNA', isBlocked: false },
    { creation: '23/02/2023', name: 'walid kadri', pharmVisits: true, medicalVisits: false, phone: '0698547125', email: 'walid@gmail.com', password: '00000000', wilaya: 'BATNA', isBlocked: false },
    { creation: '23/02/2023', name: 'walid kadri', pharmVisits: true, medicalVisits: false, phone: '0698547125', email: 'walid@gmail.com', password: '00000000', wilaya: 'BATNA', isBlocked: false },
    { creation: '23/02/2023', name: 'walid kadri', pharmVisits: true, medicalVisits: false, phone: '0698547125', email: 'walid@gmail.com', password: '00000000', wilaya: 'BATNA', isBlocked: false },
    { creation: '23/02/2023', name: 'walid kadri', pharmVisits: true, medicalVisits: false, phone: '0698547125', email: 'walid@gmail.com', password: '00000000', wilaya: 'BATNA', isBlocked: false },
    { creation: '23/02/2023', name: 'walid kadri', pharmVisits: true, medicalVisits: false, phone: '0698547125', email: 'walid@gmail.com', password: '00000000', wilaya: 'BATNA', isBlocked: false },
    { creation: '23/02/2023', name: 'walid kadri', pharmVisits: true, medicalVisits: false, phone: '0698547125', email: 'walid@gmail.com', password: '00000000', wilaya: 'BATNA', isBlocked: false },
    { creation: '23/02/2023', name: 'walid kadri', pharmVisits: true, medicalVisits: false, phone: '0698547125', email: 'walid@gmail.com', password: '00000000', wilaya: 'BATNA', isBlocked: false },
    { creation: '23/02/2023', name: 'walid kadri', pharmVisits: true, medicalVisits: false, phone: '0698547125', email: 'walid@gmail.com', password: '00000000', wilaya: 'BATNA', isBlocked: false },
    { creation: '23/02/2023', name: 'walid kadri', pharmVisits: true, medicalVisits: false, phone: '0698547125', email: 'walid@gmail.com', password: '00000000', wilaya: 'BATNA', isBlocked: false },
    { creation: '23/02/2023', name: 'walid kadri', pharmVisits: true, medicalVisits: false, phone: '0698547125', email: 'walid@gmail.com', password: '00000000', wilaya: 'BATNA', isBlocked: false },
    { creation: '23/02/2023', name: 'walid kadri', pharmVisits: true, medicalVisits: false, phone: '0698547125', email: 'walid@gmail.com', password: '00000000', wilaya: 'BATNA', isBlocked: false },
    { creation: '23/02/2023', name: 'walid kadri', pharmVisits: true, medicalVisits: false, phone: '0698547125', email: 'walid@gmail.com', password: '00000000', wilaya: 'BATNA', isBlocked: false },
    { creation: '23/02/2023', name: 'walid kadri', pharmVisits: true, medicalVisits: false, phone: '0698547125', email: 'walid@gmail.com', password: '00000000', wilaya: 'BATNA', isBlocked: false },
    { creation: '23/02/2023', name: 'walid kadri', pharmVisits: true, medicalVisits: false, phone: '0698547125', email: 'walid@gmail.com', password: '00000000', wilaya: 'BATNA', isBlocked: false },
    { creation: '23/02/2023', name: 'walid kadri', pharmVisits: true, medicalVisits: false, phone: '0698547125', email: 'walid@gmail.com', password: '00000000', wilaya: 'BATNA', isBlocked: false },
    { creation: '23/02/2023', name: 'walid kadri', pharmVisits: true, medicalVisits: false, phone: '0698547125', email: 'walid@gmail.com', password: '00000000', wilaya: 'BATNA', isBlocked: false },
    { creation: '23/02/2023', name: 'walid kadri', pharmVisits: true, medicalVisits: false, phone: '0698547125', email: 'walid@gmail.com', password: '00000000', wilaya: 'BATNA', isBlocked: false },
    { creation: '23/02/2023', name: 'walid kadri', pharmVisits: true, medicalVisits: false, phone: '0698547125', email: 'walid@gmail.com', password: '00000000', wilaya: 'BATNA', isBlocked: false },
    { creation: '23/02/2023', name: 'walid kadri', pharmVisits: true, medicalVisits: false, phone: '0698547125', email: 'walid@gmail.com', password: '00000000', wilaya: 'BATNA', isBlocked: false },
    { creation: '23/02/2023', name: 'walid kadri', pharmVisits: true, medicalVisits: false, phone: '0698547125', email: 'walid@gmail.com', password: '00000000', wilaya: 'BATNA', isBlocked: false },
    { creation: '23/02/2023', name: 'walid kadri', pharmVisits: true, medicalVisits: false, phone: '0698547125', email: 'walid@gmail.com', password: '00000000', wilaya: 'BATNA', isBlocked: false },
    { creation: '23/02/2023', name: 'walid kadri', pharmVisits: true, medicalVisits: false, phone: '0698547125', email: 'walid@gmail.com', password: '00000000', wilaya: 'BATNA', isBlocked: false },
    { creation: '23/02/2023', name: 'walid kadri', pharmVisits: true, medicalVisits: false, phone: '0698547125', email: 'walid@gmail.com', password: '00000000', wilaya: 'BATNA', isBlocked: false },
    { creation: '23/02/2023', name: 'walid kadri', pharmVisits: true, medicalVisits: false, phone: '0698547125', email: 'walid@gmail.com', password: '00000000', wilaya: 'BATNA', isBlocked: false },
    { creation: '23/02/2023', name: 'walid kadri', pharmVisits: true, medicalVisits: false, phone: '0698547125', email: 'walid@gmail.com', password: '00000000', wilaya: 'BATNA', isBlocked: false },
];

class ProfilePage extends Component<{}, ProfilePageProps> {
    constructor({ }) {
        super({});

    }

    render() {
        return (
            <div className='profile'>

                <div className='header'>
                    <CircleAvatar name='KW'></CircleAvatar>
                    <UserDetails
                        name=''
                        company=''
                        supervisor=''
                        email=''
                        phone=''
                    ></UserDetails>
                </div>
                <div className='title'>
                    <h3>Information d'équipe :</h3>
                    <h4>Ajouter un délégué</h4>
                </div>
                <ProfileTable data={data} />
            </div>
        );
    }
}

export default ProfilePage;
