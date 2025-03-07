/**
 * MeldRx API Utilities
 * 
 * This module provides functions for interacting with the MeldRx API,
 * including authentication and workspace operations.
 */

// Environment variables should be set in .env.local
const MELDRX_CLIENT_ID = process.env.MELDRX_CLIENT_ID ;
const MELDRX_CLIENT_SECRET = process.env.MELDRX_CLIENT_SECRET || '';
const MELDRX_API_BASE_URL = 'https://app.meldrx.com';

/**
 * Get system application token from MeldRx with improved error handling
 * 
 * This token is used for authenticating API requests to MeldRx
 * @returns {Promise<{access_token: string, expires_in: number, token_type: string}>}
 */
export async function getMeldRxSystemToken() {
  try {
    const params = new URLSearchParams({
      client_id: MELDRX_CLIENT_ID,
      client_secret: MELDRX_CLIENT_SECRET,
      grant_type: 'client_credentials',
      scope: 'meldrx-api patient/*.* cds'
    });

    // Add timeout to prevent hanging connections
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(`${MELDRX_API_BASE_URL}/connect/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString(),
      signal: controller.signal
    }).finally(() => clearTimeout(timeoutId));

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get MeldRx token: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return {
      access_token: data.access_token,
      expires_in: data.expires_in,
      token_type: data.token_type
    };
  } catch (error) {
    // Improved error handling
    if (error.name === 'AbortError') {
      console.error('Request timed out when connecting to MeldRx API');
      throw new Error('Connection to MeldRx API timed out. Please check your network and try again.');
    }
    
    console.error('Error getting MeldRx system token:', error);
    throw error;
  }
}

/**
 * Get workspace details from MeldRx
 * 
 * @param {string} token - The access token from getMeldRxSystemToken
 * @returns {Promise<Array<{wsIdentifier: string, tin: string, name: string, [key: string]: any}>>}
 */
export async function getWorkspaceDetails(token: string) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(`${MELDRX_API_BASE_URL}/api/workspaces/records`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      signal: controller.signal
    }).finally(() => clearTimeout(timeoutId));

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get workspace details: ${response.status} ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Request timed out when fetching workspace details');
      throw new Error('Connection to MeldRx API timed out. Please check your network and try again.');
    }
    
    console.error('Error getting workspace details:', error);
    throw error;
  }
}

/**
 * Get workspace by identifier
 * 
 * @param {string} token - The access token from getMeldRxSystemToken
 * @param {string} wsIdentifier - The workspace identifier
 * @returns {Promise<{wsIdentifier: string, tin: string, name: string, [key: string]: any}>}
 */
export async function getWorkspaceByIdentifier(token: string, wsIdentifier: string) {
  try {
    const workspaces = await getWorkspaceDetails(token);
    const workspace = workspaces.find(ws => ws.wsIdentifier === wsIdentifier);
    
    if (!workspace) {
      throw new Error(`Workspace with identifier ${wsIdentifier} not found`);
    }
    
    return workspace;
  } catch (error) {
    console.error('Error getting workspace by identifier:', error);
    throw error;
  }
}

/**
 * Get workspace by TIN (Tax Identification Number)
 * 
 * @param {string} token - The access token from getMeldRxSystemToken
 * @param {string} tin - The Tax Identification Number
 * @returns {Promise<{wsIdentifier: string, tin: string, name: string, [key: string]: any}>}
 */
export async function getWorkspaceByTIN(token: string, tin: string) {
  try {
    const workspaces = await getWorkspaceDetails(token);
    const workspace = workspaces.find(ws => ws.tin === tin);
    
    if (!workspace) {
      throw new Error(`Workspace with TIN ${tin} not found`);
    }
    
    return workspace;
  } catch (error) {
    console.error('Error getting workspace by TIN:', error);
    throw error;
  }
}

/**
 * Get patients from MeldRx
 * 
 * @param {string} token - The access token from getMeldRxSystemToken
 * @param {string} [mipsReportId] - Optional MIPS Report ID for context
 * @param {object} [queryParams] - Optional query parameters for filtering
 * @returns {Promise<Array<any>>} - List of patients
 */
export async function getPatients(token: string, mipsReportId?: string, queryParams?: Record<string, string>) {
  try {
    // Build URL with query parameters if provided
    let url = `${MELDRX_API_BASE_URL}/patients`;
    if (queryParams) {
      const params = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, value]) => {
        params.append(key, value);
      });
      url += `?${params.toString()}`;
    }
    
    // Prepare headers
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${token}`
    };
    
    // Add MIPS Report ID context if provided
    if (mipsReportId) {
      headers['MipsReportId-Context'] = mipsReportId;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get patients: ${response.status} ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting patients:', error);
    throw error;
  }
}

/**
 * Get patient by ID
 * 
 * @param {string} token - The access token from getMeldRxSystemToken
 * @param {string} patientId - The patient ID
 * @param {string} [mipsReportId] - Optional MIPS Report ID for context
 * @returns {Promise<any>} - Patient details
 */
export async function getPatientById(token: string, patientId: string, mipsReportId?: string) {
  try {
    // Prepare headers
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${token}`
    };
    
    // Add MIPS Report ID context if provided
    if (mipsReportId) {
      headers['MipsReportId-Context'] = mipsReportId;
    }
    
    const response = await fetch(`${MELDRX_API_BASE_URL}/patients/${patientId}`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get patient by ID: ${response.status} ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting patient by ID:', error);
    throw error;
  }
}

/**
 * Submit clinical report to MeldRx
 * 
 * @param {string} token - The access token from getMeldRxSystemToken
 * @param {string} wsIdentifier - The workspace identifier
 * @param {object} reportData - The clinical report data
 * @returns {Promise<any>} - The response from MeldRx
 */
export async function submitClinicalReport(token: string, wsIdentifier: string, reportData: any) {
  try {
    // This is a placeholder endpoint - replace with the actual MeldRx endpoint for submitting reports
    const response = await fetch(`${MELDRX_API_BASE_URL}/api/workspaces/${wsIdentifier}/reports`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reportData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to submit clinical report: ${response.status} ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting clinical report:', error);
    throw error;
  }
}

/**
 * Cache for storing the MeldRx token to avoid unnecessary API calls
 */
let tokenCache: {
  token: string;
  expiresAt: number;
} | null = null;

/**
 * Get a valid MeldRx token, using the cache if available
 * 
 * @returns {Promise<string>} - A valid access token
 */
export async function getValidToken(): Promise<string> {
  const now = Date.now();
  
  // If we have a cached token that's still valid (with 5-minute buffer), return it
  if (tokenCache && tokenCache.expiresAt > now + 5 * 60 * 1000) {
    return tokenCache.token;
  }
  
  // Otherwise, get a new token
  const tokenData = await getMeldRxSystemToken();
  
  // Cache the token with its expiration time
  tokenCache = {
    token: tokenData.access_token,
    expiresAt: now + (tokenData.expires_in * 1000)
  };
  
  return tokenData.access_token;
}

/**
 * Initialize MeldRx connection
 * 
 * This function verifies that we can connect to MeldRx and logs workspace information
 * @returns {Promise<boolean>} - True if connection is successful
 */
export async function initializeMeldRxConnection(): Promise<boolean> {
  try {
    console.log('Initializing MeldRx connection...');
    
    const token = await getValidToken();
    const workspaces = await getWorkspaceDetails(token);
    
    console.log(`Successfully connected to MeldRx. Found ${workspaces.length} workspaces.`);
    
    // Log workspace identifiers (but not full details for security)
    workspaces.forEach((ws, index) => {
      console.log(`Workspace ${index + 1}: ID=${ws.wsIdentifier}, Name=${ws.name}`);
    });
    
    return true;
  } catch (error) {
    console.error('Failed to initialize MeldRx connection:', error);
    return false;
  }
} 