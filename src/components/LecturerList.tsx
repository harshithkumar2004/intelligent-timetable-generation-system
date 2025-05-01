import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import LecturerForm from './LecturerForm';
import { Edit2, Trash2 } from 'lucide-react';

const LecturerList: React.FC = () => {
  const { state, dispatch } = useTimetable();
  const [editingLecturer, setEditingLecturer] = useState<string | null>(null);
  
  const handleEdit = (lecturerId: string) => {
    setEditingLecturer(lecturerId);
  };
  
  const handleDelete = (lecturerId: string) => {
    if (window.confirm('Are you sure you want to delete this lecturer? This will also remove all their timetable entries.')) {
      dispatch({ type: 'DELETE_LECTURER', payload: lecturerId });
    }
  };
  
  // Get subject names for a lecturer
  const getSubjectNames = (subjectIds: string[]): string => {
    return subjectIds
      .map(id => {
        const subject = state.subjects.find(s => s.id === id);
        return subject ? subject.code : '';
      })
      .filter(Boolean)
      .join(', ');
  };
  
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Manage Lecturers</h2>
      
      {state.lecturers.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">No lecturers added yet.</p>
          <p className="text-sm text-gray-400 mt-2">
            Start by adding a lecturer using the "Add Lecturer" button.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Subjects
                </th>
                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {state.lecturers.map(lecturer => (
                <tr key={lecturer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {lecturer.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {getSubjectNames(lecturer.subjects)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(lecturer.id)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(lecturer.id)}
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
      
      {/* Edit Lecturer Modal */}
      {editingLecturer && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <LecturerForm 
            onClose={() => setEditingLecturer(null)} 
            editLecturer={state.lecturers.find(l => l.id === editingLecturer)}
          />
        </div>
      )}
    </div>
  );
};

export default LecturerList;