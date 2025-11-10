'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserProfile } from '@/types';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [siren, setSiren] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [bank, setBank] = useState('');
  const [iban, setIban] = useState('');
  const [bic, setBic] = useState('');
  const [termsConditions, setTermsConditions] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const profileData = await response.json();
        setProfile(profileData);
        setName(profileData.name || '');
        setAddress(profileData.address || '');
        setEmail(profileData.email || '');
        setPhone(profileData.phone || '');
        setWebsite(profileData.website || '');
        setSiren(profileData.siren || '');
        setVatNumber(profileData.vat_number || '');
        setBank(profileData.bank || '');
        setIban(profileData.iban || '');
        setBic(profileData.bic || '');
        setTermsConditions(profileData.terms_conditions || '');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          address,
          email: email,
          phone: phone,
          website: website,
          siren: siren,
          vat_number: vatNumber,
          bank: bank,
          iban: iban,
          bic: bic,
          terms_conditions: termsConditions
        }),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setMessage('Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your personal information used in quotes and invoices</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-md ${
            message.includes('success') 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your full name or business name"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your business address"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+33 1 23 45 67 89"
              />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="text"
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="www.yourwebsite.com"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty to hide from documents</p>
            </div>

            <div>
              <label htmlFor="siren" className="block text-sm font-medium text-gray-700 mb-2">
                SIREN
              </label>
              <input
                type="text"
                id="siren"
                value={siren}
                onChange={(e) => setSiren(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="123 456 789"
              />
            </div>

            <div>
              <label htmlFor="vatNumber" className="block text-sm font-medium text-gray-700 mb-2">
                VAT Number
              </label>
              <input
                type="text"
                id="vatNumber"
                value={vatNumber}
                onChange={(e) => setVatNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="FR12345678901"
              />
            </div>

            <h3 className="text-lg font-medium text-gray-900 mt-8 mb-4">Payment Information</h3>
            
            <div>
              <label htmlFor="bank" className="block text-sm font-medium text-gray-700 mb-2">
                Bank
              </label>
              <input
                type="text"
                id="bank"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Bank name"
              />
            </div>

            <div>
              <label htmlFor="iban" className="block text-sm font-medium text-gray-700 mb-2">
                IBAN
              </label>
              <input
                type="text"
                id="iban"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="FR14 2004 1010 0505 0001 3M02 606"
              />
            </div>

            <div>
              <label htmlFor="bic" className="block text-sm font-medium text-gray-700 mb-2">
                BIC/SWIFT
              </label>
              <input
                type="text"
                id="bic"
                value={bic}
                onChange={(e) => setBic(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="SOGEFRPP"
              />
            </div>

            <h3 className="text-lg font-medium text-gray-900 mt-8 mb-4">Terms & Conditions</h3>
            
            <div>
              <label htmlFor="termsConditions" className="block text-sm font-medium text-gray-700 mb-2">
                Terms and Conditions
              </label>
              <textarea
                id="termsConditions"
                value={termsConditions}
                onChange={(e) => setTermsConditions(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Payment terms, delivery conditions, etc."
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
              <Link
                href="/"
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}