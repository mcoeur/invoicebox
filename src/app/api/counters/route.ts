import { NextRequest, NextResponse } from 'next/server';
import { DocumentService } from '@/lib/services/documentService';

export async function GET() {
  try {
    const counters = await DocumentService.getCounters();
    return NextResponse.json(counters);
  } catch (error) {
    console.error('Error fetching counters:', error);
    return NextResponse.json({ error: 'Failed to fetch counters' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.type || typeof data.counter !== 'number') {
      return NextResponse.json({ error: 'Type and counter are required' }, { status: 400 });
    }

    if (data.type !== 'quote' && data.type !== 'invoice') {
      return NextResponse.json({ error: 'Type must be quote or invoice' }, { status: 400 });
    }

    await DocumentService.updateCounter(data.type, data.counter);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating counter:', error);
    return NextResponse.json({ error: 'Failed to update counter' }, { status: 500 });
  }
}
