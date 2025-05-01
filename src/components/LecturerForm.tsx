import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import { Lecturer } from '../types';
import { PlusCircle, X } from 'lucide-react';

interface LecturerFormProps {
  onClose?: () => void;
  editLecturer?: Lecturer;
}

const LecturerForm: React.FC<LecturerFormProps> = ({ onClose, editLecturer }) => {
  const { state, dispatch } = useTimetable();
  const [name, setName] = useState(editLecturer?.name || '');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    editLecturer?.subjects || []
  );
  const [selectedSections, setSelectedSections] = useState<('A' | 'B')[]>(
    editLecturer?.sections || []
  );
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Lecturer name is required');
      return;
    }
    
    if (selectedSubjects.length === 0) {
      setError('Please assign at least one subject');
      return;
    }
    
    if (selectedSections.length === 0) {
      setError('Please assign at least one section');
      return;
    }
    
    const lecturerData = {
      name,
      subjects: selectedSubjects,
      sections: selectedSections
    };
    
    if (editLecturer) {
      dispatch({
        type: 'UPDATE_LECTURER',
        payload: { ...lecturerData, id: editLecturer.id }
      });
    } else {
      dispatch({
        type: 'ADD_LECTURER',
        payload: lecturerData
      });
    }
    
    if (onClose) onClose();
  };

  const toggleSubject = (subjectId: string) => {
    if (selectedSubjects.includes(subjectId)) {
      setSelectedSubjects(selectedSubjects.filter(id => id !== subjectId));
    } else {
      setSelectedSubjects([...selectedSubjects, subjectId]);
    }
  };

  const toggleSection = (section: 'A' | 'B') => {
    if (selectedSections.includes(section)) {
      setSelectedSections(selectedSections.filter(s => s !== section));
    } else {
      setSelectedSections([...selectedSections, section]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {editLecturer ? 'Edit Lecturer' : 'Add New Lecturer'}
        </h2>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
            Lecturer Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Dr. John Smith"
          />
        </div>
        
          <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign Sections
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedSections.includes('A')}
                  onChange={() => toggleSection('A')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Section A</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedSections.includes('B')}
                  onChange={() => toggleSection('B')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Section B</span>
          </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign Subjects
            </label>
            <div className="border rounded-md divide-y max-h-48 overflow-y-auto">
              {state.subjects.map(subject => (
                <label
                  key={subject.id}
                  className="flex items-center p-2 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedSubjects.includes(subject.id)}
                    onChange={() => toggleSubject(subject.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="ml-2">
                    <div className="text-sm font-medium text-gray-700">
                      {subject.code}
                    </div>
                    <div className="text-xs text-gray-500">
                      {subject.name}
                    </div>
                  </div>
                  </label>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {editLecturer ? 'Update Lecturer' : 'Add Lecturer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LecturerForm;