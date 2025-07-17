import { NextRequest, NextResponse } from 'next/server';

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'https://nebib-forms-production-c7f6.up.railway.app',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    }
  });
}

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const response = NextResponse.json({ success: true });

  response.headers.set('Access-Control-Allow-Origin', 'https://nebib-forms-production-c7f6.up.railway.app');
  response.headers.set('Access-Control-Allow-Credentials', 'true');

  return response;
}
