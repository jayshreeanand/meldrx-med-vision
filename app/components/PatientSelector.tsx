import React, { useState } from 'react';
import { useMeldRxPatients } from '@/app/hooks/useMeldRxPatients';

interface PatientSelectorProps {
  onSelectPatient: (patient: any) => void;
  mipsReportId?: string;
}

const PatientSelector: React.FC<PatientSelectorProps> = ({ 
  onSelectPatient,
  mipsReportId
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { patients, loading, error } = useMeldRxPatients({
    mipsReportId,
    queryParams: searchTerm ? { search: searchTerm } : undefined
  });
  
  return (
    <div className="w-full max-w-md">
      <div className="mb-4">
        <label htmlFor="patient-search" className="block text-sm font-medium text-gray-700 mb-1">
          Search Patients
        </label>
        <input
          id="patient-search"
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search by name, DOB, or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="border border-gray-200 rounded-md overflow-hidden">
        {loading ? (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading patients...</p>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">
            <p>Error loading patients: {error.message}</p>
          </div>
        ) : patients && patients.length > 0 ? (
          <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
            {patients.map((patient) => (
              <li 
                key={patient.id} 
                className="p-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelectPatient(patient)}
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {patient.firstName} {patient.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    ID: {patient.id}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 text-center text-gray-500">
            {searchTerm ? 'No patients found matching your search.' : 'No patients available.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientSelector; 