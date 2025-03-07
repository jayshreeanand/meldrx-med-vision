import { useState, useEffect } from 'react';

interface UseMeldRxPatientsOptions {
  mipsReportId?: string;
  queryParams?: Record<string, string>;
  enabled?: boolean;
}

interface UseMeldRxPatientsResult {
  patients: any[] | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * React hook to fetch patients from MeldRx
 * 
 * @param {UseMeldRxPatientsOptions} options - Options for fetching patients
 * @returns {UseMeldRxPatientsResult} - Patients data, loading state, and error
 */
export function useMeldRxPatients(options: UseMeldRxPatientsOptions = {}): UseMeldRxPatientsResult {
  const { mipsReportId, queryParams, enabled = true } = options;
  
  const [patients, setPatients] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build URL with query parameters
      let url = '/api/meldrx/patients';
      const params = new URLSearchParams();
      
      // Add mipsReportId if provided
      if (mipsReportId) {
        params.append('mipsReportId', mipsReportId);
      }
      
      // Add other query parameters if provided
      if (queryParams) {
        Object.entries(queryParams).forEach(([key, value]) => {
          params.append(key, value);
        });
      }
      
      // Add query parameters to URL if any
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      // Fetch patients
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch patients');
      }
      
      const data = await response.json();
      setPatients(data.patients);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Unknown error'));
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (enabled) {
      fetchPatients();
    }
  }, [enabled, mipsReportId, JSON.stringify(queryParams)]);
  
  return {
    patients,
    loading,
    error,
    refetch: fetchPatients
  };
} 