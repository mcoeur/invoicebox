import { NextRequest, NextResponse } from 'next/server';
import { ClientService } from '@/lib/services/clientService';
import { CreateClientRequest } from '@/types';

export async function GET() {
  try {
    const clients = await ClientService.getAllClients();
    return NextResponse.json(clients);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: CreateClientRequest = await request.json();
    
    if (!data.name || !data.address) {
      return NextResponse.json({ error: 'Name and address are required' }, { status: 400 });
    }

    const client = await ClientService.createClient(data);
    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
  }
}