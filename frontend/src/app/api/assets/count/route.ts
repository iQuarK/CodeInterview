import { NextResponse } from 'next/server';

import { BASE_URL } from '@/constant/env';

export async function GET() {
  const response = await fetch(`${BASE_URL}/assets/count`);
  const data = await response.json();
  return NextResponse.json(data);
}
