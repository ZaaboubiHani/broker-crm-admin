
import React from 'react';
import HomePage from '../../pages/home-page/home-page.component';
import ProfilePage from '../../pages/profile-page/profile-page.component';
import '../content/content.style.css';
import ExpensePage from '../../pages/expense-page/expense-pae.component';


interface ContentProps {
    activeItem: string;
}

const Content: React.FC<ContentProps> = ({ activeItem }) => {
    return (
        <div className="content">
            {activeItem === 'Home' && <HomePage></HomePage>}
            {activeItem === 'About' && <div>About Content</div>}
            {activeItem === 'Expense' && <ExpensePage></ExpensePage>}
            {activeItem === 'Profile' && <ProfilePage></ProfilePage>}
        </div>
    );
};

export default Content;
