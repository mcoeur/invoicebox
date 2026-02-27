'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Counter = { type: 'quote' | 'invoice'; counter: number };

export default function SettingsPage() {
  const [counters, setCounters] = useState<Record<'quote' | 'invoice', number>>({
    quote: 0,
    invoice: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Record<'quote' | 'invoice', boolean>>({
    quote: false,
    invoice: false,
  });
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const fetchCounters = async () => {
      try {
        const res = await fetch('/api/counters');
        if (res.ok) {
          const data = (await res.json()) as Counter[];
          const next = { quote: 0, invoice: 0 } as Record<'quote' | 'invoice', number>;
          for (const row of data) {
            next[row.type] = row.counter;
          }
          setCounters(next);
        }
      } catch (err) {
        console.error('Error fetching counters:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCounters();
  }, []);

  const updateCounter = async (type: 'quote' | 'invoice') => {
    setSaving((s) => ({ ...s, [type]: true }));
    setMessage('');
    try {
      const res = await fetch('/api/counters', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, counter: counters[type] }),
      });
      if (res.ok) {
        setMessage('Counters updated successfully.');
        setTimeout(() => setMessage(''), 2500);
      } else {
        const data = await res.json().catch(() => ({}));
        console.error('Failed to update counter:', data);
        setMessage('Failed to update counters.');
      }
    } catch (err) {
      console.error('Error updating counter:', err);
      setMessage('Failed to update counters.');
    } finally {
      setSaving((s) => ({ ...s, [type]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">
              Manage document numbering counters for quotes and invoices.
            </p>
          </div>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Back to Dashboard
          </Link>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-md ${
              message.includes('successfully')
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
            }`}
          >
            {message}
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Quote counter</h2>
            <p className="text-sm text-gray-600 mb-4">
              Sets the current sequence used when generating new quote numbers.
            </p>
            <div className="flex items-center gap-4">
              <input
                type="number"
                min={0}
                value={counters.quote}
                onChange={(e) => setCounters((c) => ({ ...c, quote: Number(e.target.value) }))}
                className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => updateCounter('quote')}
                disabled={saving.quote}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving.quote ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>

          <hr className="border-gray-200" />

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Invoice counter</h2>
            <p className="text-sm text-gray-600 mb-4">
              Sets the current sequence used when generating new invoice numbers.
            </p>
            <div className="flex items-center gap-4">
              <input
                type="number"
                min={0}
                value={counters.invoice}
                onChange={(e) => setCounters((c) => ({ ...c, invoice: Number(e.target.value) }))}
                className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => updateCounter('invoice')}
                disabled={saving.invoice}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving.invoice ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

