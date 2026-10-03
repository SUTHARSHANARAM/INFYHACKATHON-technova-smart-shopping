import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { addressService } from '../services/addressService';
import { Address } from '../types';
import { MapPin, User as UserIcon, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await addressService.getAddresses();
      if (res.data) setAddresses(res.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await addressService.deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      showToast('Address deleted', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete address', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Overview */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-brand-500/20">
          {user?.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">{user?.name}</h1>
          <p className="text-xs text-gray-500">{user?.email}</p>
          <span className="inline-block mt-2 bg-brand-50 text-brand-700 font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-brand-200">
            {user?.role} Account
          </span>
        </div>
      </div>

      {/* Saved Addresses Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-600" /> Saved Delivery Addresses ({addresses.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-2 relative">
              {addr.isDefault && (
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded float-right">
                  DEFAULT
                </span>
              )}
              <h4 className="font-bold text-xs text-gray-900">{addr.fullName}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {addr.addressLine1} {addr.addressLine2 && `, ${addr.addressLine2}`}
                <br />
                {addr.city}, {addr.state} - {addr.postalCode}
              </p>
              <p className="text-xs font-semibold text-gray-800 pt-1">Phone: {addr.phone}</p>
              <button
                onClick={() => handleDeleteAddress(addr.id)}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 pt-2"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
