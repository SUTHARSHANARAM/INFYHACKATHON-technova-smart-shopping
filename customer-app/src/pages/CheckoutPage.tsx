import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, CreditCard, ShieldCheck, Check, ArrowRight, Plus, AlertCircle, ShoppingBag } from 'lucide-react';
import { addressService } from '../services/addressService';
import { cartService } from '../services/cartService';
import { orderService } from '../services/orderService';
import { Address, CartSummary } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useToast } from '../context/ToastContext';

const addressSchema = z.object({
  fullName: z.string().min(2, 'Full Name is required'),
  phone: z.string().min(10, 'Valid 10-digit phone number is required'),
  addressLine1: z.string().min(5, 'Address Line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().min(5, 'Postal Code is required'),
  country: z.string().default('India'),
});

type AddressFormValues = z.infer<typeof addressSchema>;

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [step, setStep] = useState<number>(1);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showNewAddressForm, setShowNewAddressForm] = useState<boolean>(false);
  const [cart, setCart] = useState<CartSummary | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'UPI' | 'COD'>('CARD');
  const [loading, setLoading] = useState<boolean>(true);
  const [placingOrder, setPlacingOrder] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting: isAddressSubmitting },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: 'India' },
  });

  useEffect(() => {
    fetchCheckoutData();
  }, []);

  const fetchCheckoutData = async () => {
    setLoading(true);
    try {
      const [addrRes, cartRes] = await Promise.all([
        addressService.getAddresses(),
        cartService.getCart(),
      ]);

      if (addrRes.data) {
        setAddresses(addrRes.data);
        const defaultAddr = addrRes.data.find((a) => a.isDefault) || addrRes.data[0];
        if (defaultAddr) setSelectedAddressId(defaultAddr.id);
        else setShowNewAddressForm(true);
      }

      if (cartRes.data) {
        if (!cartRes.data.items || cartRes.data.items.length === 0) {
          showToast('Your cart is empty. Please add items before checkout.', 'info');
          navigate('/cart');
          return;
        }
        setCart(cartRes.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to initialize checkout', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (data: AddressFormValues) => {
    try {
      const res = await addressService.createAddress({ ...data, isDefault: true });
      if (res.data) {
        setAddresses((prev) => [res.data, ...prev]);
        setSelectedAddressId(res.data.id);
        setShowNewAddressForm(false);
        reset();
        showToast('Shipping address saved!', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to save address', 'error');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      showToast('Please select or add a shipping address', 'error');
      return;
    }

    setPlacingOrder(true);
    try {
      const res = await orderService.createOrder(selectedAddressId);
      if (res.data) {
        showToast('Order created successfully!', 'success');
        navigate(`/order-confirmation/${res.data.id}`);
      }
    } catch (err: any) {
      showToast(err.message || 'Order creation failed', 'error');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) return <LoadingSpinner label="Preparing your checkout details..." />;

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Checkout Header & Steps */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Checkout</h1>
          <p className="text-xs text-gray-500 mt-1">Complete your order with TechNova simulated checkout</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className={`px-3 py-1.5 rounded-xl ${step >= 1 ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
            1. Address
          </span>
          <span>→</span>
          <span className={`px-3 py-1.5 rounded-xl ${step >= 2 ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
            2. Payment & Place Order
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Address Selection & Payment Simulation */}
        <div className="lg:col-span-2 space-y-8">
          {/* STEP 1: Address Selection */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-600" /> 1. Shipping Address
              </h2>
              {!showNewAddressForm && (
                <button
                  onClick={() => setShowNewAddressForm(true)}
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add New Address
                </button>
              )}
            </div>

            {showNewAddressForm ? (
              <form onSubmit={handleSubmit(handleAddAddress)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="Rahul Sharma"
                      {...register('fullName')}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm"
                    />
                    {errors.fullName && <p className="text-xs text-rose-500 mt-1">{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number</label>
                    <input
                      type="text"
                      placeholder="+91 9876543210"
                      {...register('phone')}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm"
                    />
                    {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Address Line 1</label>
                  <input
                    type="text"
                    placeholder="Flat / House No., Building Name, Street"
                    {...register('addressLine1')}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm"
                  />
                  {errors.addressLine1 && <p className="text-xs text-rose-500 mt-1">{errors.addressLine1.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    placeholder="Landmark, Area"
                    {...register('addressLine2')}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">City</label>
                    <input
                      type="text"
                      placeholder="Bengaluru"
                      {...register('city')}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm"
                    />
                    {errors.city && <p className="text-xs text-rose-500 mt-1">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">State</label>
                    <input
                      type="text"
                      placeholder="Karnataka"
                      {...register('state')}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm"
                    />
                    {errors.state && <p className="text-xs text-rose-500 mt-1">{errors.state.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Postal Code</label>
                    <input
                      type="text"
                      placeholder="560103"
                      {...register('postalCode')}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm"
                    />
                    {errors.postalCode && <p className="text-xs text-rose-500 mt-1">{errors.postalCode.message}</p>}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isAddressSubmitting}
                    className="py-2.5 px-5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl transition-colors"
                  >
                    Save Address
                  </button>
                  {addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowNewAddressForm(false)}
                      className="py-2.5 px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedAddressId === addr.id
                        ? 'border-brand-600 bg-brand-50/40 ring-2 ring-brand-500/20 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-gray-900">{addr.fullName}</span>
                      {selectedAddressId === addr.id && <Check className="w-4 h-4 text-brand-600" />}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {addr.addressLine1} {addr.addressLine2 && `, ${addr.addressLine2}`}
                      <br />
                      {addr.city}, {addr.state} - {addr.postalCode}
                    </p>
                    <p className="text-xs font-semibold text-gray-800 mt-2">Phone: {addr.phone}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* STEP 2: Simulated Payment Selection */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-600" /> 2. Simulated Payment Method
              </h2>
              <span className="bg-amber-100 text-amber-900 font-bold text-[10px] uppercase px-2.5 py-1 rounded-full border border-amber-200">
                Official Hackathon Simulation
              </span>
            </div>

            <div className="space-y-3">
              <label
                onClick={() => setPaymentMethod('CARD')}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'CARD' ? 'border-brand-600 bg-brand-50/40 ring-2 ring-brand-500/20' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-brand-600 flex items-center justify-center">
                    {paymentMethod === 'CARD' && <div className="w-2 h-2 rounded-full bg-brand-600" />}
                  </div>
                  <div>
                    <p className="font-bold text-xs text-gray-900">Simulated Credit / Debit Card</p>
                    <p className="text-[11px] text-gray-500">Instant order confirmation without real charge</p>
                  </div>
                </div>
                <CreditCard className="w-5 h-5 text-gray-400" />
              </label>

              <label
                onClick={() => setPaymentMethod('UPI')}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'UPI' ? 'border-brand-600 bg-brand-50/40 ring-2 ring-brand-500/20' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-brand-600 flex items-center justify-center">
                    {paymentMethod === 'UPI' && <div className="w-2 h-2 rounded-full bg-brand-600" />}
                  </div>
                  <div>
                    <p className="font-bold text-xs text-gray-900">Simulated UPI / QR Code</p>
                    <p className="text-[11px] text-gray-500">Google Pay / PhonePe / Paytm simulation</p>
                  </div>
                </div>
              </label>

              <label
                onClick={() => setPaymentMethod('COD')}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'COD' ? 'border-brand-600 bg-brand-50/40 ring-2 ring-brand-500/20' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-brand-600 flex items-center justify-center">
                    {paymentMethod === 'COD' && <div className="w-2 h-2 rounded-full bg-brand-600" />}
                  </div>
                  <div>
                    <p className="font-bold text-xs text-gray-900">Cash on Delivery (COD)</p>
                    <p className="text-[11px] text-gray-500">Pay cash upon express doorstep delivery</p>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Final Order Review & Submit Order Button */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 sticky top-28">
          <h2 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100">
            Order Review
          </h2>

          {/* Mini Items List */}
          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {cart?.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <img src={item.image} alt={item.productName} className="w-8 h-8 object-contain bg-gray-50 rounded p-0.5 flex-shrink-0" />
                  <span className="truncate text-gray-700 font-medium">{item.productName}</span>
                </div>
                <span className="font-bold text-gray-900 flex-shrink-0">
                  {item.quantity} x ₹{item.price.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs pt-3 border-t border-gray-100">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-bold text-gray-900">₹{cart?.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="font-bold text-emerald-600">FREE</span>
            </div>
            <div className="flex justify-between text-lg font-extrabold text-gray-900 pt-2 border-t border-gray-100">
              <span>Total Payable</span>
              <span className="text-brand-600">₹{cart?.subtotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {selectedAddress && (
            <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-600 space-y-1">
              <p className="font-bold text-gray-900">Shipping To:</p>
              <p className="truncate">{selectedAddress.fullName}, {selectedAddress.city}</p>
            </div>
          )}

          <button
            onClick={handlePlaceOrder}
            disabled={placingOrder || !selectedAddressId}
            className="w-full py-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 text-sm"
          >
            {placingOrder ? 'Processing Order...' : 'Place Order & Complete Simulation'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
