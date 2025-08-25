'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Document } from '@/types';

export default function DocumentViewPage({ params }: { params: { id: string } }) {
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchDocument();
  }, []);

  const fetchDocument = async () => {
    try {
      const response = await fetch(`/api/documents/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setDocument(data);
      } else {
        router.push('/documents');
      }
    } catch (error) {
      console.error('Error fetching document:', error);
      router.push('/documents');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Document not found</div>
      </div>
    );
  }

  const documentTitle = document.type === 'quote' ? 'Quote' : 'Invoice';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {documentTitle} {document.number}
            </h1>
            <p className="text-gray-600 mt-2">
              Created on {new Date(document.created_at).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors print:hidden"
          >
            Print
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-8 print:shadow-none">
          <div className="grid grid-cols-1 print:grid-cols-2 md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="text-gray-700">
                {document.my_name && (
                  <div className="font-semibold text-gray-900 mb-2">{document.my_name}</div>
                )}
                <div className="whitespace-pre-line mb-2">{document.my_address}</div>
                {document.my_email && (
                  <div className="text-sm">
                    <span className="font-medium">Email:</span> {document.my_email}
                  </div>
                )}
                {document.my_phone && (
                  <div className="text-sm">
                    <span className="font-medium">Phone:</span> {document.my_phone}
                  </div>
                )}
                {document.my_website && (
                  <div className="text-sm">
                    <span className="font-medium">Website:</span> {document.my_website}
                  </div>
                )}
                {document.my_siren && (
                  <div className="text-sm">
                    <span className="font-medium">SIREN:</span> {document.my_siren}
                  </div>
                )}
                {document.my_vat_number && (
                  <div className="text-sm">
                    <span className="font-medium">VAT:</span> {document.my_vat_number}
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="text-gray-700">
                {document.client_name && (
                  <div className="font-semibold text-gray-900 mb-2">{document.client_name}</div>
                )}
                <div className="whitespace-pre-line mb-2">{document.client_address}</div>
                {document.client_siren && (
                  <div className="text-sm">
                    <span className="font-medium">SIREN:</span> {document.client_siren}
                  </div>
                )}
                {document.client_vat_number && (
                  <div className="text-sm">
                    <span className="font-medium">VAT Number:</span> {document.client_vat_number}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Services</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                      Unit
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                      Unit Price
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase border-b border-gray-200">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {document.sections?.map((section, index) => (
                    <tr key={section.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-4 border-b border-gray-200">
                        <div className="font-medium text-gray-900">{section.name}</div>
                        {section.description && (
                          <div className="text-sm text-gray-600">{section.description}</div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-left border-b border-gray-200 text-sm text-gray-700 capitalize">
                        {section.unit}
                      </td>
                      <td className="px-4 py-4 text-right border-b border-gray-200 text-sm text-gray-700">
                        {section.quantity}
                      </td>
                      <td className="px-4 py-4 text-right border-b border-gray-200 text-sm text-gray-700">
                        €{section.unit_price.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-right border-b border-gray-200 text-sm font-medium text-gray-900">
                        €{section.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="max-w-md ml-auto space-y-2">
              <div className="flex justify-between text-base">
                <span className="font-medium text-gray-700">Subtotal:</span>
                <span className="text-gray-900">€{document.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="font-medium text-gray-700">
                  VAT ({(document.vat_rate * 100).toFixed(0)}%):
                </span>
                <span className="text-gray-900">€{document.vat_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                <span className="text-gray-900">Total:</span>
                <span className="text-gray-900">€{document.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4 print:hidden">
          <Link
            href="/documents"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            ← Back to Documents
          </Link>
        </div>
      </div>
    </div>
  );
}