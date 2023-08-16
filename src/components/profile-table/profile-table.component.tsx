import React from 'react';
import './profile-table.style.css';

interface ProfileTableProps {
    data: any[];
}


const columnsHeaders = ['Création', 'Nom et prénom', 'Visite pharmaceutique', 'Visite médical', 'Mobile', 'E-mail', 'Mot de passe', 'Wilaya', 'Blocage'];
const columnsKeys = ['creation', 'name', 'pharmVisits', 'medicalVisits', 'phone', 'email', 'password', 'wilaya', 'isBlocked'];


const ProfileTable: React.FC<ProfileTableProps> = ({ data }) => {
    return (
        <div className='table-container'>

            <table className="table">
                <thead>
                    <tr>
                        <th key='0'>Création</th>
                        <th key='1'>Nom et prénom</th>
                        <th key='2'>Visite pharmaceutique</th>
                        <th key='3'>Visite médical</th>
                        <th key='4'>Mobile</th>
                        <th key='5'>E-mail</th>
                        <th key='6'>Mot de passe</th>
                        <th key='7'>Wilaya</th>
                        <th key='8'>Blocage</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            <td key='0'>{row['creation']}</td>
                            <td key='1'>{row['name']}</td>
                            <td key='2'>
                                <label className="switch">
                                    <input type="checkbox" checked={row['pharmVisits']} />
                                    <span className="slider" >
                                    </span>
                                </label>
                            </td>
                            <td key='3'>
                                <label className="switch">
                                    <input type="checkbox" checked={row['medicalVisits']} />
                                    <span className="slider" >
                                    </span>
                                </label>

                            </td>
                            <td key='4'>{row['phone']}</td>
                            <td key='5'>{row['email']}</td>
                            <td key='6'>{row['password']}</td>
                            <td key='7'>{row['wilaya']}</td>
                            <td key='8'>
                                <label className="switch">
                                    <input type="checkbox" checked={row['isBlocked']} />
                                    <span className="slider" >
                                    </span>
                                </label>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProfileTable;
