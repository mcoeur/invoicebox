import { NextResponse } from 'next/server';
import { DocumentService } from '@/lib/services/documentService';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const quoteId = parseInt(params.id);
    
    if (isNaN(quoteId)) {
      return NextResponse.json({ error: 'Invalid quote ID' }, { status: 400 });
    }

    const invoice = await DocumentService.createInvoiceFromQuote(quoteId);
    
    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error('Error converting quote to invoice:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to convert quote to invoice' },
      { status: 500 }
    );
  }
}