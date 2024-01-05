
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/sidebar/sidebar.component';
import HomePage from '../pages/home-page/home-page.component';
import PlanPage from '../pages/plan-page/plan-page.component';
import ProfilePage from '../pages/profile-page/profile-page.component';
import LoginPage from '../pages/login-page/login-page.component';
import ReportPage from '../pages/report-page/report-page.component';
import { useLocation } from 'react-router-dom';
import DelegatePage from '../pages/delegate-page/delegate-page.component';
import CommandPage from '../pages/command-page/command-page.component';
import ExpensePage from '../pages/expense-page/expense-page.component';
import RevenuePage from '../pages/revenue-page/revenue-page.component';
import StatisticsPage from '../pages/statistics-page/statistics-page.component';
import ConfigPage from '../pages/config-page/config-page.component';
import ClientsPage from '../pages/clients-page/clients-page.component';

const AppRouter: React.FC = () => {

  const location = useLocation();

  return (
    <div>
      <Routes>
        <Route path="/" Component={LoginPage} />
        <Route path="/login" Component={LoginPage} />
      </Routes>
      {
        location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/content' ? (
          <div style={{ width: '100%', height: '100vh', margin: '0px', padding: '0px' }}>
            <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}>
              <div>
                <Sidebar />
              </div>
              <div style={{ flexGrow: '1', width: '100%', overflow: 'auto', height: '100%' }}>
                <Routes>
                  <Route path="/home" Component={HomePage} />
                  <Route path="/delegate" Component={DelegatePage} />
                  <Route path="/plan" Component={PlanPage} />
                  <Route path="/report" Component={ReportPage} />
                  <Route path="/profile" Component={ProfilePage} />
                  <Route path="/command" Component={CommandPage} />
                  <Route path="/expense" Component={ExpensePage} />
                  <Route path="/clients" Component={ClientsPage} />
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
