import React from 'react';
import { useGetStudents } from '../hooks/useQueries';
import { getSessionToken } from '../hooks/useAuth';
import { Loader2, Users, User } from 'lucide-react';

export default function AdminStudents() {
  const token = getSessionToken() || '';
  const { data: students = [], isLoading } = useGetStudents(token);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white font-rajdhani">Students</h1>
        <p className="text-navy-400 text-sm mt-1">View all registered students</p>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-navy-400 py-8">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading students...
        </div>
      ) : students.length === 0 ? (
        <div className="bg-navy-800 border border-navy-600 rounded-xl p-12 text-center">
          <Users className="w-12 h-12 text-navy-500 mx-auto mb-3" />
          <p className="text-navy-400">No students registered yet.</p>
        </div>
      ) : (
        <div className="bg-navy-800 border border-navy-600 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-navy-600">
                <th className="text-left px-4 py-3 text-navy-300 text-sm font-medium">Photo</th>
                <th className="text-left px-4 py-3 text-navy-300 text-sm font-medium">Mobile Number</th>
                <th className="text-left px-4 py-3 text-navy-300 text-sm font-medium">Student ID</th>
                <th className="text-left px-4 py-3 text-navy-300 text-sm font-medium">Registered</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr
                  key={student.id.toString()}
                  className="border-b border-navy-700 last:border-0 hover:bg-navy-700/30"
                >
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-navy-700 border border-navy-600 flex items-center justify-center">
                      {student.profilePhotoBase64 ? (
                        <img
                          src={`data:image/jpeg;base64,${student.profilePhotoBase64}`}
                          alt={student.mobileNumber}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-navy-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white font-medium">{student.mobileNumber}</td>
                  <td className="px-4 py-3 text-navy-400 text-sm">#{student.id.toString()}</td>
                  <td className="px-4 py-3 text-navy-400 text-sm">
                    {new Date(Number(student.registeredAt) / 1_000_000).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
