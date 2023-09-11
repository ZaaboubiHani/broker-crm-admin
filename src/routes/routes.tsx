
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../components/sidebar/sidebar.component';
import HomePage from '../pages/home-page/home-page.component';
import PlanPage from '../pages/plan-page/plan-page.component';
import ProfilePage from '../pages/profile-page/profile-page.component';
import LoginPage from '../pages/login-page/login-page.component';
import Content from '../components/content/content.component';
import ReportPage from '../pages/report-page/report-page.component';
import { Link, useLocation } from 'react-router-dom';
import DelegatePage from '../pages/delegate-page/delegate-page.component';
import CommandCamPage from '../pages/command-pages/command-cam-page/command-cam-page.component';
import CommandDelegatePage from '../pages/command-pages/command-delegate-page/command-delegate-page.component';
import ExpensePage from '../pages/expense-page/expense-page.component';
import ClientsPharmacyPage from '../pages/clients-pages/clients-pharmacy-page/clients-pharmacy-page.component';
import ClientsDoctorPage from '../pages/clients-pages/clients-doctor-page/clients-doctor-page.component';
import ClientsWholesalerPage from '../pages/clients-pages/clients-wholesaler-page/clients-wholesaler-page.component';
import RevenuePage from '../pages/revenue-page/revenue-page.component';
import StatisticsPage from '../pages/statistics-page/statistics-page.component';
import ConfigPage from '../pages/config-page/config-page.component';

const AppRouter: React.FC = () => {

  const location = useLocation();

  return (
    <div>
      <Routes>
        <Route path="/" Component={LoginPage} />
        <Route path="/login" Component={LoginPage} />
        <Route path="/content" Component={Content} />
      </Routes>
      {
        location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/content' ? (
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
                  <Route path="/report" Component={ReportPage} />
                  <Route path="/profile" Component={ProfilePage} />
                  <Route path="/command/cam" Component={CommandCamPage} />
                  <Route path="/command/delegates" Component={CommandDelegatePage} />
                  <Route path="/expense" Component={ExpensePage} />
                  <Route path="/clients/pharmacy" Component={ClientsPharmacyPage} />
                  <Route path="/clients/doctor" Component={ClientsDoctorPage} />
                  <Route path="/clients/wholesaler" Component={ClientsWholesalerPage} />
                  <Route path="/revenue" Component={RevenuePage} />
                  <Route path="/statistics" Component={StatisticsPage} />
                  <Route path="/config" Component={ConfigPage} />
                </Routes>
              </div>
            </div>
          </div>) : null
      }
    </div>
  );
};

export default AppRouter;
