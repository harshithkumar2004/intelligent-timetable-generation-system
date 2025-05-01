import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import SubjectForm from './SubjectForm';
import LecturerForm from './LecturerForm';
import RoomForm from './RoomForm';
import TimetableGrid from './TimetableGrid';
import SubjectList from './SubjectList';
import LecturerList from './LecturerList';
import RoomList from './RoomList';
import { downloadJson, saveToLocalStorage } from '../utils/helpers';
import { 
  Calendar, 
  FileUp, 
  FileDown, 
  RefreshCw, 
  Trash2,
  Printer
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { state, dispatch, hasConflicts } = useTimetable();
  const [activeTab, setActiveTab] = useState<'subjects' | 'lecturers' | 'rooms' | 'timetable'>('timetable');
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showAddLecturer, setShowAddLecturer] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);
  
  // Handle timetable generation
  const handleGenerateTimetable = () => {
    dispatch({ type: 'GENERATE_TIMETABLE' });
  };
  
  // Handle timetable clearing
  const handleClearTimetable = () => {
    if (window.confirm('Are you sure you want to clear the current timetable?')) {
      dispatch({ type: 'CLEAR_TIMETABLE' });
    }
  };
  
  // Save timetable state
  const handleSaveTimetable = () => {
    saveToLocalStorage('timetableState', state);
    alert('Timetable saved successfully!');
  };
  
  // Export timetable as JSON
  const handleExportTimetable = () => {
    downloadJson(state, 'college-timetable.json');
  };
  
  // Import timetable from JSON
  const handleImportTimetable = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedState = JSON.parse(event.target?.result as string);
          dispatch({ type: 'LOAD_STATE', payload: importedState });
          alert('Timetable imported successfully!');
        } catch (error) {
          console.error('Error importing timetable:', error);
          alert('Failed to import timetable. Invalid file format.');
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  };
  
  // Print timetable
  const handlePrintTimetable = () => {
    window.print();
  };
  
  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
            <Calendar className="mr-2 text-blue-600" />
            Smart College Timetable
          </h1>
          <p className="text-gray-600 mt-1">
            Intelligent timetable generation system for academic scheduling
          </p>
        </div>
        
        <div className="flex mt-4 md:mt-0 space-x-2">
          <button
            onClick={handleSaveTimetable}
            className="px-3 py-2 text-sm bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors flex items-center"
          >
            <FileDown size={16} className="mr-1" />
            Save
          </button>
          <button
            onClick={handleExportTimetable}
            className="px-3 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
          >
            <FileDown size={16} className="mr-1" />
            Export
          </button>
          <button
            onClick={handleImportTimetable}
            className="px-3 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center"
          >
            <FileUp size={16} className="mr-1" />
            Import
          </button>
          <button
            onClick={handlePrintTimetable}
            className="px-3 py-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center"
          >
            <Printer size={16} className="mr-1" />
            Print
          </button>
        </div>
      </header>
      
      <div className="flex flex-col md:flex-row mb-6 gap-4">
        <div className="w-full md:w-1/4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Actions</h2>
            
            <div className="space-y-2">
              <button
                onClick={() => setShowAddSubject(true)}
                className="w-full px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Subject
              </button>
              
              <button
                onClick={() => setShowAddLecturer(true)}
                className="w-full px-4 py-2 text-sm text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors"
                disabled={state.subjects.length === 0}
              >
                Add Lecturer
              </button>
              
              <button
                onClick={() => setShowAddRoom(true)}
                className="w-full px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
              >
                Add Room
              </button>
              
              <button
                onClick={handleGenerateTimetable}
                className="w-full px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
                disabled={
                  state.subjects.length === 0 || 
                  state.lecturers.length === 0 ||
                  state.rooms.length === 0
                }
              >
                <RefreshCw size={16} className="mr-1" />
                Generate Timetable
              </button>
              
              <button
                onClick={handleClearTimetable}
                className="w-full px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center"
                disabled={state.entries.length === 0}
              >
                <Trash2 size={16} className="mr-1" />
                Clear Timetable
              </button>
            </div>
            
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-800 mb-2">Stats</h3>
              <ul className="space-y-1 text-sm">
                <li className="flex justify-between">
                  <span className="text-gray-600">Subjects:</span>
                  <span className="font-medium">{state.subjects.length}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Lecturers:</span>
                  <span className="font-medium">{state.lecturers.length}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Rooms:</span>
                  <span className="font-medium">{state.rooms.length}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Total Classes:</span>
                  <span className="font-medium">{state.entries.length}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Conflicts:</span>
                  <span className={`font-medium ${hasConflicts() ? 'text-red-500' : 'text-green-500'}`}>
                    {hasConflicts() ? 'Yes' : 'None'}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-3/4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('timetable')}
                  className={`py-4 px-6 text-sm font-medium border-b-2 focus:outline-none ${
                    activeTab === 'timetable'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Timetable
                </button>
                <button
                  onClick={() => setActiveTab('subjects')}
                  className={`py-4 px-6 text-sm font-medium border-b-2 focus:outline-none ${
                    activeTab === 'subjects'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Subjects
                </button>
                <button
                  onClick={() => setActiveTab('lecturers')}
                  className={`py-4 px-6 text-sm font-medium border-b-2 focus:outline-none ${
                    activeTab === 'lecturers'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Lecturers
                </button>
                <button
                  onClick={() => setActiveTab('rooms')}
                  className={`py-4 px-6 text-sm font-medium border-b-2 focus:outline-none ${
                    activeTab === 'rooms'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Rooms
                </button>
              </nav>
            </div>
            
            <div className="p-4">
              {activeTab === 'timetable' && (
                <div>
                  {state.entries.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="mx-auto h-16 w-16 text-gray-400" />
                      <h3 className="mt-4 text-lg font-medium text-gray-900">No timetable yet</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Start by adding subjects, lecturers, and rooms, then generate your timetable.
                      </p>
                      <div className="mt-6">
                        <button
                          onClick={handleGenerateTimetable}
                          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                          disabled={
                            state.subjects.length === 0 || 
                            state.lecturers.length === 0 ||
                            state.rooms.length === 0
                          }
                        >
                          Generate Timetable
                        </button>
                      </div>
                    </div>
                  ) : (
                    <TimetableGrid />
                  )}
                </div>
              )}
              
              {activeTab === 'subjects' && <SubjectList />}
              {activeTab === 'lecturers' && <LecturerList />}
              {activeTab === 'rooms' && <RoomList />}
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Subject Modal */}
      {showAddSubject && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <SubjectForm onClose={() => setShowAddSubject(false)} />
        </div>
      )}
      
      {/* Add Lecturer Modal */}
      {showAddLecturer && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <LecturerForm onClose={() => setShowAddLecturer(false)} />
        </div>
      )}
      
      {/* Add Room Modal */}
      {showAddRoom && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <RoomForm onClose={() => setShowAddRoom(false)} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;