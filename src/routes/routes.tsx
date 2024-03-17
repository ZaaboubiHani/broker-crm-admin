import React, { useEffect } from 'react';
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
import TaskPage from '../pages/task-page/task-page.component';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';



const firebaseConfig = {
  apiKey: "AIzaSyDAWwxAAwu6HH2uPyig2b7i6_CXk7E4ZQw",
  authDomain: "broker-crm-44ab3.firebaseapp.com",
  projectId: "broker-crm-44ab3",
  storageBucket: "broker-crm-44ab3.appspot.com",
  messagingSenderId: "1035112336953",
  appId: "1:1035112336953:web:8eecf79ef91d9bfcbc47e8",
  measurementId: "G-0J414GVMTX"
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

function requestPermission() {
  console.log('Requesting permission...');
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      // Get the FCM token 
      getToken(messaging).then((currentToken) => {
        if (currentToken) {
          console.log('FCM token:', currentToken);
          localStorage.setItem('fcmToken', currentToken);
        } else {
          console.log('No registration token available. Request permission to generate one.');
        }
      }).catch((err) => {
        console.error('An error occurred while retrieving token. ', err);
      });
    }
  });
}

const AppRouter: React.FC = () => {
  const location = useLocation();
  useEffect(() => {
    requestPermission();
    const handleMessage = (payload:any
      ) => {
      if (payload.data?.location) {
        let coordinates = payload.data.location.replace(/Latitude: |Longitude: /g, '').split(',');
        const latitude = coordinates[0].trim();
        const longitude = coordinates[1].trim();
        const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
        window.open(url, '_blank');
        console.log(coordinates);
      }
    };

    onMessage(messaging, handleMessage);

   
  }, []);
  

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
                  <Route path="/task" Component={TaskPage} />
                </Routes>
              </div>
            </div>
          </div>) : null
      }
    </div>
  );
};

export default AppRouter;
