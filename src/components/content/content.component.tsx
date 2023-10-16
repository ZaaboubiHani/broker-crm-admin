
import React from 'react';
import HomePage from '../../pages/home-page/home-page.component';
import ProfilePage from '../../pages/profile-page/profile-page.component';
import '../content/content.style.css';
import DelegatePage from '../../pages/delegate-page/delegate-page.component';
import PlanPage from '../../pages/plan-page/plan-page.component';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../sidebar/sidebar.component';



interface ContentProps {

}

const Content: React.FC<ContentProps> = () => {
  return (
    <div style={{ width: '100%', height: '100vh', margin: '0px', padding: '0px' }}>
      <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}>
        <div style={{ width: '200px' }}>
          <Sidebar />
        </div>
        <div style={{ flexGrow: '1', width: '100%', overflow: 'auto', height: '100%' }}>
          <Routes>
            <Route path="/home" Component={HomePage} />
            <Route path="/delegate" Component={DelegatePage} />
            <Route path="/plan" Component={PlanPage} />
            <Route path="/profile" Component={ProfilePage} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Content;
