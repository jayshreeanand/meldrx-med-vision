import { NextRequest, NextResponse } from 'next/server';
import { getValidToken, getPatientById } from '@/app/lib/meldrx-utils';

/**
 * API route to get a patient by ID from MeldRx
 * 
 * @param {NextRequest} req - The request object
 * @param {object} params - The route parameters
 * @returns {Promise<NextResponse>} - The response object
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { patientId: string } }
) {
  try {
    const { patientId } = params;
    
    // Get query parameters
    const url = new URL(req.url);
    const mipsReportId = url.searchParams.get('mipsReportId') || undefined;
    
    // Get a valid token
    const token = await getValidToken();
    
    // Get patient by ID
    const patient = await getPatientById(token, patientId, mipsReportId);
    
    // Return the patient
    return NextResponse.json({ 
      success: true,
      patient
    });
  } catch (error) {
    console.error('Error in /api/meldrx/patients/[patientId]:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get patient',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 