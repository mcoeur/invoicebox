'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Client, CreateDocumentSectionRequest, UserProfile } from '@/types';

export default function NewDocumentPage() {
  const searchParams = useSearchParams();
  const documentType = (searchParams.get('type') || 'quote') as 'quote' | 'invoice';
  
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<number | ''>('');
  const [myAddress, setMyAddress] = useState('');
  const [myName, setMyName] = useState('');
  const [myEmail, setMyEmail] = useState('');
  const [myPhone, setMyPhone] = useState('');
  const [myWebsite, setMyWebsite] = useState('');
  const [mySiren, setMySiren] = useState('');
  const [myVatNumber, setMyVatNumber] = useState('');
  const [sections, setSections] = useState<CreateDocumentSectionRequest[]>([
    { name: '', description: '', unit: 'day', quantity: 1, unit_price: 0 }
  ]);
  const [vatRate, setVatRate] = useState(0.20);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchClients();
    fetchUserProfile();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients');
      if (response.ok) {
        const data = await response.json();
        setClients(data);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const profile: UserProfile = await response.json();
        // Set individual fields
        setMyName(profile.name || '');
        setMyAddress(profile.address || '');
        setMyEmail(profile.email || '');
        setMyPhone(profile.phone || '');
        setMyWebsite(profile.website || '');
        setMySiren(profile.siren || '');
        setMyVatNumber(profile.vat_number || '');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const addSection = () => {
    setSections([...sections, { name: '', description: '', unit: 'day', quantity: 1, unit_price: 0 }]);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const updateSection = (index: number, field: keyof CreateDocumentSectionRequest, value: any) => {
    const updatedSections = [...sections];
    updatedSections[index] = { ...updatedSections[index], [field]: value };
    setSections(updatedSections);
  };

  const calculateSubtotal = () => {
    return sections.reduce((sum, section) => sum + (section.quantity * section.unit_price), 0);
  };

  const calculateVat = () => {
    return calculateSubtotal() * vatRate;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateVat();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: documentType,
          client_id: selectedClientId,
          my_address: myAddress,
          my_name: myName,
          my_email: myEmail || undefined,
          my_phone: myPhone || undefined,
          my_website: myWebsite || undefined,
          my_siren: mySiren || undefined,
          my_vat_number: myVatNumber || undefined,
          sections: sections,
          vat_rate: vatRate,
        }),
      });

      if (response.ok) {
        router.push('/documents');
      } else {
        alert(`Failed to create ${documentType}`);
      }
    } catch (error) {
      console.error(`Error creating ${documentType}:`, error);
      alert(`Failed to create ${documentType}`);
    } finally {
      setLoading(false);
    }
  };

  const documentTitle = documentType === 'quote' ? 'Quote' : 'Invoice';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New {documentTitle}</h1>
          <p className="text-gray-600 mt-2">Generate a new {documentType} for your client</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-2">
                  Client *
                </label>
                <select
                  id="client"
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(Number(e.target.value) || '')}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="vatRate" className="block text-sm font-medium text-gray-700 mb-2">
                  VAT Rate
                </label>
                <select
                  id="vatRate"
                  value={vatRate}
                  onChange={(e) => setVatRate(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={0}>0%</option>
                  <option value={0.10}>10%</option>
                  <option value={0.20}>20%</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Your Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="myName" className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="myName"
                    value={myName}
                    onChange={(e) => setMyName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your name or business name"
                  />
                </div>

                <div>
                  <label htmlFor="myEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="myEmail"
                    value={myEmail}
                    onChange={(e) => setMyEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="myPhone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="myPhone"
                    value={myPhone}
                    onChange={(e) => setMyPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>

                <div>
                  <label htmlFor="myWebsite" className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    id="myWebsite"
                    value={myWebsite}
                    onChange={(e) => setMyWebsite(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://www.yourwebsite.com"
                  />
                </div>

                <div>
                  <label htmlFor="mySiren" className="block text-sm font-medium text-gray-700 mb-1">
                    SIREN
                  </label>
                  <input
                    type="text"
                    id="mySiren"
                    value={mySiren}
                    onChange={(e) => setMySiren(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123 456 789"
                  />
                </div>

                <div>
                  <label htmlFor="myVatNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    VAT Number
                  </label>
                  <input
                    type="text"
                    id="myVatNumber"
                    value={myVatNumber}
                    onChange={(e) => setMyVatNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="FR12345678901"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="myAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <textarea
                  id="myAddress"
                  value={myAddress}
                  onChange={(e) => setMyAddress(e.target.value)}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your business address"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Sections</h3>
                <button
                  type="button"
                  onClick={addSection}
                  className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors text-sm"
                >
                  Add Section
                </button>
              </div>

              {sections.map((section, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-800">Section {index + 1}</h4>
                    {sections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSection(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={section.name}
                        onChange={(e) => updateSection(index, 'name', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Section name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={section.description}
                        onChange={(e) => updateSection(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Description"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unit
                      </label>
                      <select
                        value={section.unit}
                        onChange={(e) => updateSection(index, 'unit', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="day">Day</option>
                        <option value="hour">Hour</option>
                        <option value="mission">Mission</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={section.quantity}
                        onChange={(e) => updateSection(index, 'quantity', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unit Price (€)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={section.unit_price}
                        onChange={(e) => updateSection(index, 'unit_price', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  <div className="mt-2 text-right">
                    <span className="text-sm text-gray-600">
                      Section Total: €{(section.quantity * section.unit_price).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <div className="text-right space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Subtotal:</span>
                  <span>€{calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">VAT ({(vatRate * 100).toFixed(0)}%):</span>
                  <span>€{calculateVat().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>€{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : `Create ${documentTitle}`}
              </button>
              <Link
                href="/documents"
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}