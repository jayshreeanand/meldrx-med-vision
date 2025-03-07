import { NextResponse } from 'next/server';
import { getValidToken } from '@/app/lib/meldrx-utils';

/**
 * API route to get a valid MeldRx token
 * 
 * @returns {Promise<NextResponse>} - The response object with the token
 */
export async function GET() {
  try {
    // Get a valid token
    const token = await getValidToken();
    
    // Return the token
    return NextResponse.json({ 
      success: true,
      token
    });
  } catch (error) {
    console.error('Error in /api/meldrx/token:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get token',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 