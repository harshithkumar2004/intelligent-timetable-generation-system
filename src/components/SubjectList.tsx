import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import SubjectForm from './SubjectForm';
import { Edit2, Trash2 } from 'lucide-react';

const SubjectList: React.FC = () => {
  const { state, dispatch } = useTimetable();
  const [editingSubject, setEditingSubject] = useState<string | null>(null);
  
  const handleEdit = (subjectId: string) => {
    setEditingSubject(subjectId);
  };
  
  const handleDelete = (subjectId: string) => {
    if (window.confirm('Are you sure you want to delete this subject? This will also remove it from all timetable entries.')) {
      dispatch({ type: 'DELETE_SUBJECT', payload: subjectId });
    }
  };
  
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Manage Subjects</h2>
      
      {state.subjects.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">No subjects added yet.</p>
          <p className="text-sm text-gray-400 mt-2">
            Start by adding a subject using the "Add Subject" button.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credits
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lab
                </th>
                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {state.subjects.map(subject => (
                <tr key={subject.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {subject.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {subject.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {subject.credits}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {subject.type === 'lab' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(subject.id)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(subject.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Edit Subject Modal */}
      {editingSubject && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <SubjectForm 
            onClose={() => setEditingSubject(null)} 
            editSubject={state.subjects.find(s => s.id === editingSubject)}
          />
        </div>
      )}
    </div>
  );
};

export default SubjectList;