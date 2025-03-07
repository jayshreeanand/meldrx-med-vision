import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { wsIdentifier, reportData } = await req.json();
    
    // Validate required fields
    if (!wsIdentifier) {
      return NextResponse.json(
        { success: false, error: 'Workspace identifier is required' },
        { status: 400 }
      );
    }
    
    if (!reportData) {
      return NextResponse.json(
        { success: false, error: 'Report data is required' },
        { status: 400 }
      );
    }
    
    // Simulate a slight delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock success response
    return NextResponse.json({
      success: true,
      result: {
        reportId: "rep_" + Math.random().toString(36).substring(2, 10),
        timestamp: new Date().toISOString(),
        status: "submitted",
        workspace: wsIdentifier,
        summary: "Report successfully submitted"
      }
    });
  } catch (error) {
    console.error('Error in mock submit report:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to submit clinical report',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 