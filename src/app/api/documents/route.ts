import { NextRequest, NextResponse } from 'next/server';
import { DocumentService } from '@/lib/services/documentService';
import { CreateDocumentRequest } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') as 'quote' | 'invoice' | null;
    
    const documents = await DocumentService.getAllDocuments(type || undefined);
    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: CreateDocumentRequest = await request.json();
    
    if (!data.client_id || !data.my_address || !data.sections?.length) {
      return NextResponse.json({ 
        error: 'Client_id, my_address, and sections are required' 
      }, { status: 400 });
    }

    if (!['quote', 'invoice'].includes(data.type)) {
      return NextResponse.json({ 
        error: 'Type must be either quote or invoice' 
      }, { status: 400 });
    }

    const document = await DocumentService.createDocument(data);
    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error('Document creation error:', error);
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });
  }
}