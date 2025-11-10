'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Document } from '@/types';

export default function DocumentsPage() {
  const t = useTranslations('documents');
  const tCommon = useTranslations('common');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'quote' | 'invoice'>('all');

  useEffect(() => {
    fetchDocuments();
  }, [filter]);

  const fetchDocuments = async () => {
    try {
      const url = filter === 'all' ? '/api/documents' : `/api/documents?type=${filter}`;
      const response = await fetch(url);
      
      if (response.ok) {
        const documents = await response.json();
        setDocuments(documents);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id: number, type: 'quote' | 'invoice') => {
    if (!confirm(t('deleteConfirm'))) {
      return;
    }

    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      });

      console.log(`Delete ${type} response status:`, response.status);
      
      if (response.ok) {
        setDocuments(prevDocuments => prevDocuments.filter(doc => doc.id !== id));
        console.log(`${type} deleted, updating UI`);
      } else {
        const errorData = await response.json();
        console.error('Delete failed:', errorData);
        alert(t('deleteFailed'));
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      alert(t('deleteFailed'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">{tCommon('loading')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
            <p className="text-gray-600 mt-2">{t('subtitle')}</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/documents/new?type=quote"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              {t('newQuote')}
            </Link>
            <Link
              href="/documents/new?type=invoice"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              {t('newInvoice')}
            </Link>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {t('filterAll')}
            </button>
            <button
              onClick={() => setFilter('quote')}
              className={`px-4 py-2 rounded-md transition-colors ${
                filter === 'quote'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {t('filterQuotes')}
            </button>
            <button
              onClick={() => setFilter('invoice')}
              className={`px-4 py-2 rounded-md transition-colors ${
                filter === 'invoice'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {t('filterInvoices')}
            </button>
          </div>
        </div>

        {documents.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 mb-4">{t('noDocuments')}</p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/documents/new?type=quote"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {t('createFirstQuote')}
              </Link>
              <span className="text-gray-400">{tCommon('or')}</span>
              <Link
                href="/documents/new?type=invoice"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {t('createFirstInvoice')}
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.type')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.number')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.client')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.total')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.created')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {tCommon('actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documents.map((document) => (
                  <tr key={document.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          document.type === 'quote'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {document.type.charAt(0).toUpperCase() + document.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{document.number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{(document as any).client_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">€{document.total.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(document.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/documents/${document.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        {tCommon('view')}
                      </Link>
                      <button
                        onClick={() => deleteDocument(document.id, document.type)}
                        className="text-red-600 hover:text-red-900"
                      >
                        {tCommon('delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {tCommon('backToDashboard')}
          </Link>
        </div>
      </div>
    </div>
  );
}