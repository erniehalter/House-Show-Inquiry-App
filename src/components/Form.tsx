import React, { useState, useEffect } from 'react';
import { STATES, STATE_NAMES, getDistanceTier } from '../data/states';
import { EVENT_TYPES, EventType } from '../data/pricing';
import { calculatePrice, formatCurrency } from '../utils/calculatePrice';

export default function Form() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    city: '',
    state: '',
    eventType: '' as EventType | '',
    notes: ''
  });

  const [eventCategory, setEventCategory] = useState<'houseshow' | 'wedding' | ''>('');
  const [price, setPrice] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (formData.state && formData.eventType) {
      setPrice(calculatePrice(formData.state, formData.eventType as EventType));
    } else {
      setPrice(null);
    }
  }, [formData.state, formData.eventType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getRelevantEventTypes = (): EventType[] => {
    if (eventCategory === 'houseshow') {
      return EVENT_TYPES.filter(type =>
        type === 'Weekend Evening (Friday-Sunday)' || type === 'All Other Times'
      );
    } else if (eventCategory === 'wedding') {
      return EVENT_TYPES.filter(type =>
        type.includes('Wedding')
      );
    }
    return [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: price ? formatCurrency(price) : 'N/A',
          distanceTier: formData.state ? getDistanceTier(formData.state) : 'Unknown',
          travelInfo: getTravelInfo(formData.state)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit inquiry');
      }

      setIsSuccess(true);
    } catch (err) {
      setError('There was an error submitting your inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTravelInfo = (state: string) => {
    if (!state) return '';
    return "I'll bring my Bose PA system—great for house shows to events with 300-400 people.";
  };

  if (isSuccess) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center max-w-2xl mx-auto mt-12">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Thanks {formData.firstName}!</h2>
        <p className="text-gray-600 text-lg mb-8">
          Your inquiry has been sent to Ernie.<br />
          He'll get back to you shortly at <span className="font-medium text-gray-900">{formData.email}</span>.
        </p>

        {price !== null && (
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center mb-8">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Estimated Price</h4>
            <div>
              <div className="text-5xl font-bold text-gray-900 tracking-tight mb-2">
                {formatCurrency(price)}
              </div>
              <div className="text-sm text-gray-500">
                50% deposit ({formatCurrency(price / 2)}) required to confirm booking
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            setIsSuccess(false);
            setEventCategory('');
            setFormData({
              firstName: '', lastName: '', email: '', city: '', state: '', eventType: '', notes: ''
            });
            setPrice(null);
          }}
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Submit another inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-gray-100 max-w-5xl mx-auto mt-8">
      {/* Contact Disclaimer */}
      <div className="border-b border-gray-200 pb-3 mb-6">
        <p className="text-gray-600 text-xs">
          <span className="font-medium">Other inquiry?</span> Email <a href="mailto:erniehalter@gmail.com" className="text-indigo-600 hover:underline">erniehalter@gmail.com</a>
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-6">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-2 space-y-8">

        {/* Basic Info */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Guest Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                placeholder=""
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                placeholder=""
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                placeholder=""
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input
                type="text"
                id="city"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                placeholder=""
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State *</label>
              <select
                id="state"
                name="state"
                required
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white"
              >
                <option value="">Select a state...</option>
                {STATES.map(state => (
                  <option key={state} value={state}>
                    {STATE_NAMES[state] || state}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Event Details</h3>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">What type of event is this? *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                eventCategory === 'houseshow' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="eventCategory"
                  value="houseshow"
                  checked={eventCategory === 'houseshow'}
                  onChange={(e) => {
                    setEventCategory(e.target.value as 'houseshow');
                    setFormData(prev => ({ ...prev, eventType: '' }));
                  }}
                  className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span className="ml-3 block text-sm font-medium text-gray-900">
                  House Show
                </span>
              </label>
              <label className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                eventCategory === 'wedding' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="eventCategory"
                  value="wedding"
                  checked={eventCategory === 'wedding'}
                  onChange={(e) => {
                    setEventCategory(e.target.value as 'wedding');
                    setFormData(prev => ({ ...prev, eventType: '' }));
                  }}
                  className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span className="ml-3 block text-sm font-medium text-gray-900">
                  Wedding
                </span>
              </label>
            </div>
          </div>

          {eventCategory && (
            <div className="mb-6">
              <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-2">Event Timing *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {getRelevantEventTypes().map(type => (
                  <label
                    key={type}
                    className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.eventType === type ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="eventType"
                      value={type}
                      checked={formData.eventType === type}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      required
                    />
                    <span className="ml-3 block text-sm font-medium text-gray-900">
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {formData.state && (
            <div className="bg-blue-50 p-4 rounded-lg text-blue-800 text-sm mb-6 flex items-start">
              <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>
                {getTravelInfo(formData.state)}
              </p>
            </div>
          )}

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Anything else I should know? (Optional)</label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors resize-y"
              placeholder="Special requests, venue details, etc."
            />
          </div>
        </div>

        </div>

        {/* Right Column: Pricing (Sticky) */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center lg:sticky lg:top-8">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Estimated Price</h4>
            {price !== null ? (
              <div>
                <div className="text-5xl font-bold text-gray-900 tracking-tight mb-4">
                  {formatCurrency(price)}
                </div>
                {formData.state && ['AK', 'HI', 'Outside The US'].includes(formData.state) && (
                  <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
                    Note: Flight costs not included in pricing
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-600 py-3">
                Select state & timing
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm mb-6">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !formData.state || !formData.eventType || !eventCategory}
        className={`w-full py-4 px-6 rounded-xl text-white font-medium text-lg transition-all shadow-md
          ${(isSubmitting || !formData.state || !formData.eventType || !eventCategory)
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg active:transform active:scale-[0.99]'
          }`}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
      </button>
    </form>
  );
}
