
import React, { useState } from 'react';
import '../user-details/user-details.style.css';


interface UserDetailsProps {
    name: string,
    company: string,
    supervisor?: string,
    phone: string,
    email: string,
}

const UserDetails: React.FC<UserDetailsProps> = ({ name, company, supervisor, phone,email }) => {


    return (
        <div className="user-details">

            <h1 style={{fontSize:'20px'}}>{name}</h1>
            <h2 style={{fontSize:'17px'}}>Société : {company}</h2>
            {supervisor ? (<h2 style={{fontSize:'17px'}}>Superviseur : {supervisor}</h2>) : undefined}
            <h2 style={{fontSize:'17px'}}>mobile : {phone}</h2>
            <h2 style={{fontSize:'17px'}}>E-mail : {email}</h2>
        </div>
    );
};

export default UserDetails;
