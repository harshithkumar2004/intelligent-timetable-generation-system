import React, { useEffect } from 'react';
import { TimetableProvider } from './context/TimetableContext';
import Dashboard from './components/Dashboard';

function App() {
  // Update the page title
  useEffect(() => {
    document.title = 'Smart College Timetable';
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <TimetableProvider>
        <Dashboard />
      </TimetableProvider>
    </div>
  );
}

export default App;