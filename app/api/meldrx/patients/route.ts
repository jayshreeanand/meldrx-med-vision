import { NextRequest, NextResponse } from 'next/server';
import { getValidToken, getPatients } from '@/app/lib/meldrx-utils';

/**
 * API route to get patients from MeldRx
 * 
 * @param {NextRequest} req - The request object
 * @returns {Promise<NextResponse>} - The response object
 */
export async function GET(req: NextRequest) {
  try {
    // Get query parameters
    const url = new URL(req.url);
    const mipsReportId = url.searchParams.get('mipsReportId') || undefined;
    
    // Build query parameters object from URL search params
    const queryParams: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      if (key !== 'mipsReportId') { // Skip mipsReportId as it's handled separately
        queryParams[key] = value;
      }
    });
    
    // Get a valid token
    const token = await getValidToken();
    
    // Get patients
    const patients = await getPatients(token, mipsReportId, queryParams);
    
    // Return the patients
    return NextResponse.json({ 
      success: true,
      patients
    });
  } catch (error) {
    console.error('Error in /api/meldrx/patients:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get patients',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 