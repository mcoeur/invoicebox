'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Client } from '@/types';

export default function EditClientPage({ params }: { params: { id: string } }) {
  const t = useTranslations('clients');
  const tCommon = useTranslations('common');
  const [client, setClient] = useState<Client | null>(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [siren, setSiren] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchClient();
  }, []);

  const fetchClient = async () => {
    try {
      const response = await fetch(`/api/clients/${params.id}`);
      if (response.ok) {
        const clientData = await response.json();
        setClient(clientData);
        setName(clientData.name);
        setAddress(clientData.address);
        setSiren(clientData.siren || '');
        setVatNumber(clientData.vat_number || '');
      } else {
        router.push('/clients');
      }
    } catch (error) {
      console.error('Error fetching client:', error);
      router.push('/clients');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/clients/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, address, siren: siren || undefined, vat_number: vatNumber || undefined }),
      });

      if (response.ok) {
        router.push('/clients');
      } else {
        alert('Failed to update client');
      }
    } catch (error) {
      console.error('Error updating client:', error);
      alert('Failed to update client');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">{tCommon('loading')}</div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">{t('edit.notFound')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('edit.title')}</h1>
          <p className="text-gray-600 mt-2">{t('edit.subtitle')}</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.name')} {t('form.nameRequired')}
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('form.namePlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.address')} {t('form.addressRequired')}
              </label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('form.addressPlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="siren" className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.siren')}
              </label>
              <input
                type="text"
                id="siren"
                value={siren}
                onChange={(e) => setSiren(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('form.sirenPlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="vatNumber" className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.vatNumber')}
              </label>
              <input
                type="text"
                id="vatNumber"
                value={vatNumber}
                onChange={(e) => setVatNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('form.vatNumberPlaceholder')}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? t('edit.updating') : t('edit.update')}
              </button>
              <Link
                href="/clients"
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                {tCommon('cancel')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}