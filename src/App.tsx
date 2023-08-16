import React, {useState } from 'react';
import './App.css';
import DatePickerBar from './components/date-picker/date-picker.component';
import Sidebar from './components/sidebar/sidebar.component';
import Content from './components/content/content.component';


function App() {
  const [activeItem, setActiveItem] = useState('Expense');

  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };
  return (
    <div className="App">
       <div className="app-container">
      <Sidebar onItemClick={handleItemClick} />
      <Content activeItem={activeItem} />
    </div>
    </div>
  );
}

export default App;
