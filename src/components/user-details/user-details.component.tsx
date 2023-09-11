
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

            <h1>{name}</h1>
            <h2>Société : {company}</h2>
            {supervisor ? (<h2>Superviseur : {supervisor}</h2>) : undefined}
            <h2>mobile : {phone}</h2>
            <h2>E-mail : {email}</h2>
        </div>
    );
};

export default UserDetails;
