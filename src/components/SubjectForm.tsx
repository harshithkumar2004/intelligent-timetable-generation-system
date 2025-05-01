import React, { useState } from 'react';
import { SubjectType, FixedSessionType, Subject } from '../types';
import { generateRandomColor } from '../utils/helpers';
import { useTimetable } from '../context/TimetableContext';
import { PlusCircle, X } from 'lucide-react';

interface SubjectFormProps {
  onClose?: () => void;
  editSubject?: Subject;
}

const SubjectForm: React.FC<SubjectFormProps> = ({ onClose, editSubject }) => {
  const { dispatch } = useTimetable();
  const [name, setName] = useState(editSubject?.name || '');
  const [code, setCode] = useState(editSubject?.code || '');
  const [credits, setCredits] = useState<number>(editSubject?.credits || 3);
  const [type, setType] = useState<SubjectType>(editSubject?.type || 'theory');
  const [fixedSessionType, setFixedSessionType] = useState<FixedSessionType | undefined>(
    editSubject?.fixedSessionType
  );
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !code.trim()) {
      setError('Subject name and code are required');
      return;
    }
    
    if (type === 'fixed' && !fixedSessionType) {
      setError('Fixed session type is required for fixed sessions');
      return;
    }
    
    const subjectData = {
      name,
      code,
      credits,
      type,
      fixedSessionType: type === 'fixed' ? fixedSessionType : undefined,
      color: editSubject?.color || generateRandomColor()
    };
    
    if (editSubject) {
      dispatch({
        type: 'UPDATE_SUBJECT',
        payload: { ...subjectData, id: editSubject.id }
      });
    } else {
      dispatch({
        type: 'ADD_SUBJECT',
        payload: subjectData
      });
    }
    
    if (onClose) onClose();
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {editSubject ? 'Edit Subject' : 'Add New Subject'}
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
            Subject Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Data Structures"
          />
        </div>
        
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject Code
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., CS201"
          />
        </div>
        
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject Type
          </label>
          <select
              value={type}
              onChange={(e) => {
                setType(e.target.value as SubjectType);
                if (e.target.value !== 'fixed') {
                  setFixedSessionType(undefined);
                }
              }}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
              <option value="theory">Theory</option>
              <option value="lab">Lab</option>
              <option value="tutorial">Tutorial</option>
              <option value="elective">Elective</option>
              <option value="fixed">Fixed Session</option>
          </select>
        </div>
        
          {type === 'fixed' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fixed Session Type
              </label>
              <select
                value={fixedSessionType}
                onChange={(e) => setFixedSessionType(e.target.value as FixedSessionType)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Session Type</option>
                <option value="mentoring">Mentoring Hour</option>
                <option value="ethics">Ethics/Value Education</option>
                <option value="project_review">Project Review</option>
              </select>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Credits
            </label>
            <input
              type="number"
              min="1"
              max="4"
              value={credits}
              onChange={(e) => setCredits(parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {editSubject ? 'Update Subject' : 'Add Subject'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubjectForm;