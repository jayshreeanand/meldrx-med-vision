'use client';

import React, { useState, useEffect } from 'react';
import { useMeldRxPatients } from '@/app/hooks/useMeldRxPatients';

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export default function MeldRxTestPage() {
  // State for token
  const [token, setToken] = useState<string | null>(null);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);

  // State for workspaces
  const [workspaces, setWorkspaces] = useState<any[] | null>(null);
  const [workspacesLoading, setWorkspacesLoading] = useState(false);
  const [workspacesError, setWorkspacesError] = useState<string | null>(null);
  
  // State for selected workspace
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('');
  
  // State for patients
  const [mipsReportId, setMipsReportId] = useState<string>('');
  const [patientSearchTerm, setPatientSearchTerm] = useState<string>('');
  const { patients, loading: patientsLoading, error: patientsError, refetch: refetchPatients } = 
    useMeldRxPatients({
      mipsReportId: mipsReportId || undefined,
      queryParams: patientSearchTerm ? { search: patientSearchTerm } : undefined,
      enabled: false // Don't fetch on mount
    });
  
  // State for selected patient
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [patientDetails, setPatientDetails] = useState<any | null>(null);
  const [patientDetailsLoading, setPatientDetailsLoading] = useState(false);
  const [patientDetailsError, setPatientDetailsError] = useState<string | null>(null);
  
  // State for clinical report
  const [reportData, setReportData] = useState<string>('{\n  "chiefComplaint": "Headache",\n  "symptoms": ["Headache for 3 days", "Mild fever"],\n  "triageLevel": "Primary Care",\n  "careRecommendations": ["Take acetaminophen as needed", "Follow up with primary care physician"]\n}');
  const [reportResponse, setReportResponse] = useState<ApiResponse | null>(null);
  const [reportLoading, setReportLoading] = useState(false);

  // Add state for mock mode
  const [useMockApi, setUseMockApi] = useState<boolean>(false);

  // Fetch token with mock support
  const fetchToken = async () => {
    try {
      setTokenLoading(true);
      setTokenError(null);
      
      const endpoint = useMockApi ? '/api/mock-meldrx/token' : '/api/meldrx/token';
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch token');
      }
      
      const data = await response.json();
      setToken(data.token);
    } catch (error) {
      setTokenError(error instanceof Error ? error.message : 'Unknown error');
      console.error('Error fetching token:', error);
    } finally {
      setTokenLoading(false);
    }
  };
  
  // Fetch workspaces
  const fetchWorkspaces = async () => {
    try {
      setWorkspacesLoading(true);
      setWorkspacesError(null);
      
      const response = await fetch('/api/meldrx/workspaces');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch workspaces');
      }
      
      const data = await response.json();
      setWorkspaces(data.workspaces);
      
      // Set first workspace as selected if available
      if (data.workspaces && data.workspaces.length > 0) {
        setSelectedWorkspace(data.workspaces[0].wsIdentifier);
      }
    } catch (error) {
      setWorkspacesError(error instanceof Error ? error.message : 'Unknown error');
      console.error('Error fetching workspaces:', error);
    } finally {
      setWorkspacesLoading(false);
    }
  };
  
  // Fetch patient details
  const fetchPatientDetails = async () => {
    if (!selectedPatient) return;
    
    try {
      setPatientDetailsLoading(true);
      setPatientDetailsError(null);
      
      let url = `/api/meldrx/patients/${selectedPatient}`;
      if (mipsReportId) {
        url += `?mipsReportId=${encodeURIComponent(mipsReportId)}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch patient details');
      }
      
      const data = await response.json();
      setPatientDetails(data.patient);
    } catch (error) {
      setPatientDetailsError(error instanceof Error ? error.message : 'Unknown error');
      console.error('Error fetching patient details:', error);
    } finally {
      setPatientDetailsLoading(false);
    }
  };
  
  // Submit clinical report
  const submitReport = async () => {
    if (!selectedWorkspace) {
      setReportResponse({
        success: false,
        error: 'Please select a workspace first'
      });
      return;
    }
    
    try {
      setReportLoading(true);
      
      let reportDataObj;
      try {
        reportDataObj = JSON.parse(reportData);
      } catch (e) {
        throw new Error('Invalid JSON in report data');
      }
      
      const response = await fetch('/api/meldrx/submit-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          wsIdentifier: selectedWorkspace,
          reportData: reportDataObj
        })
      });
      
      const data = await response.json();
      
      setReportResponse({
        success: data.success,
        data: data.result,
        error: data.error
      });
    } catch (error) {
      setReportResponse({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.error('Error submitting report:', error);
    } finally {
      setReportLoading(false);
    }
  };

  // Initialize on mount
  useEffect(() => {
    fetchToken();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">MeldRx API Test Dashboard</h1>
      
      {/* Mock API Toggle */}
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center">
          <input
            id="mock-api-toggle"
            type="checkbox"
            checked={useMockApi}
            onChange={(e) => setUseMockApi(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="mock-api-toggle" className="ml-2 block text-sm text-gray-900">
            Use Mock API (for testing without MeldRx connection)
          </label>
        </div>
        {useMockApi && (
          <p className="mt-2 text-sm text-yellow-700">
            Using mock API endpoints. Data shown is not from the actual MeldRx system.
          </p>
        )}
      </div>
      
      {/* Authentication Section */}
      <section className="mb-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Authentication</h2>
        
        <div className="mb-4">
          <button 
            onClick={fetchToken}
            disabled={tokenLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {tokenLoading ? 'Fetching...' : 'Get System Token'}
          </button>
        </div>
        
        {tokenError && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4">
            Error: {tokenError}
          </div>
        )}
        
        {token && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Token</h3>
            <div className="bg-gray-100 p-3 rounded-md overflow-x-auto">
              <code className="text-sm break-all">{token}</code>
            </div>
          </div>
        )}
      </section>
      
      {/* Workspaces Section */}
      <section className="mb-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Workspaces</h2>
        
        <div className="mb-4">
          <button 
            onClick={fetchWorkspaces}
            disabled={workspacesLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {workspacesLoading ? 'Fetching...' : 'Get Workspaces'}
          </button>
        </div>
        
        {workspacesError && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4">
            Error: {workspacesError}
          </div>
        )}
        
        {workspaces && workspaces.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Workspaces</h3>
            
            <div className="mb-4">
              <label htmlFor="workspace-select" className="block text-sm font-medium text-gray-700 mb-1">
                Select Workspace for Report Submission
              </label>
              <select
                id="workspace-select"
                value={selectedWorkspace}
                onChange={(e) => setSelectedWorkspace(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {workspaces.map((workspace) => (
                  <option key={workspace.wsIdentifier} value={workspace.wsIdentifier}>
                    {workspace.name} (ID: {workspace.wsIdentifier})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workspace ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TIN</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {workspaces.map((workspace) => (
                    <tr key={workspace.wsIdentifier}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{workspace.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{workspace.wsIdentifier}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{workspace.tin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
      
      {/* Patients Section */}
      <section className="mb-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Patients</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="mips-report-id" className="block text-sm font-medium text-gray-700 mb-1">
              MIPS Report ID (Optional)
            </label>
            <input
              id="mips-report-id"
              type="text"
              value={mipsReportId}
              onChange={(e) => setMipsReportId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter MIPS Report ID"
            />
          </div>
          
          <div>
            <label htmlFor="patient-search" className="block text-sm font-medium text-gray-700 mb-1">
              Patient Search
            </label>
            <input
              id="patient-search"
              type="text"
              value={patientSearchTerm}
              onChange={(e) => setPatientSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search patients..."
            />
          </div>
        </div>
        
        <div className="mb-4">
          <button 
            onClick={refetchPatients}
            disabled={patientsLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {patientsLoading ? 'Fetching...' : 'Get Patients'}
          </button>
        </div>
        
        {patientsError && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4">
            Error: {patientsError.message}
          </div>
        )}
        
        {patients && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Patient List</h3>
            
            {patients.length === 0 ? (
              <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-md">
                No patients found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOB</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {patients.map((patient) => (
                      <tr key={patient.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {patient.firstName} {patient.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(patient.dateOfBirth).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => {
                              setSelectedPatient(patient.id);
                              fetchPatientDetails();
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {/* Patient Details */}
        {selectedPatient && (
          <div className="mt-6 p-4 border border-gray-200 rounded-md">
            <h3 className="text-lg font-medium mb-2">Patient Details</h3>
            
            {patientDetailsLoading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Loading patient details...</p>
              </div>
            ) : patientDetailsError ? (
              <div className="p-3 bg-red-100 text-red-700 rounded-md">
                Error: {patientDetailsError}
              </div>
            ) : patientDetails ? (
              <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                <pre className="text-sm">{JSON.stringify(patientDetails, null, 2)}</pre>
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No patient details available.
              </div>
            )}
          </div>
        )}
      </section>
      
      {/* Clinical Report Section */}
      <section className="mb-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Submit Clinical Report</h2>
        
        <div className="mb-4">
          <label htmlFor="report-data" className="block text-sm font-medium text-gray-700 mb-1">
            Report Data (JSON)
          </label>
          <textarea
            id="report-data"
            value={reportData}
            onChange={(e) => setReportData(e.target.value)}
            rows={10}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          />
        </div>
        
        <div className="mb-4">
          <button 
            onClick={submitReport}
            disabled={reportLoading || !selectedWorkspace}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {reportLoading ? 'Submitting...' : 'Submit Report'}
          </button>
          {!selectedWorkspace && (
            <p className="mt-2 text-sm text-red-500">Please select a workspace first</p>
          )}
        </div>
        
        {reportResponse && (
          <div className={`p-4 rounded-md ${reportResponse.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            <h3 className="font-medium mb-2">{reportResponse.success ? 'Success' : 'Error'}</h3>
            {reportResponse.error ? (
              <p>{reportResponse.error}</p>
            ) : (
              <div className="bg-white p-3 rounded-md overflow-x-auto">
                <pre className="text-sm">{JSON.stringify(reportResponse.data, null, 2)}</pre>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
} 