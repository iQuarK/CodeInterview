import { NextRequest, NextResponse } from 'next/server';

import { BASE_URL } from '@/constant/env';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const response = await fetch(`${BASE_URL}/assets?pageNumber=${searchParams.get('pageNumber')}&pageSize=${searchParams.get('pageSize')}&host=${searchParams.get('host')}`);
  const data = await response.json();
  return NextResponse.json(data);
}
