import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { CheckCircle2 } from 'lucide-react';
import type { PlanType } from '../../types';

export const AddClientModal: React.FC = () => {
  const { isAddClientOpen, setIsAddClientOpen, addClient } = useApp();
  const [step, setStep] = useState<1 | 2>(1);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    plan: '3 Months' as PlanType,
    assignedTrainer: 'Marcus Vance',
    heightCm: 175,
    currentWeightKg: 70,
    targetWeightKg: 65,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    addClient(formData);
    setIsAddClientOpen(false);
    setStep(1);
    setFormData({
      name: '',
      email: '',
      phone: '',
      plan: '3 Months',
      assignedTrainer: 'Marcus Vance',
      heightCm: 175,
      currentWeightKg: 70,
      targetWeightKg: 65,
      notes: ''
    });
  };

  return (
    <Modal
      isOpen={isAddClientOpen}
      onClose={() => setIsAddClientOpen(false)}
      title="Onboard New Member"
      subtitle="Step-by-step registration for fitness and therapy clients"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Progress Indicator */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
          <span className={`text-xs font-bold ${step === 1 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
            1. Personal Info
          </span>
          <span className={`text-xs font-bold ${step === 2 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
            2. Fitness & Membership
          </span>
        </div>

        {step === 1 && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Siddharth Malhotra"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. siddharth@example.in"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98000 00000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!formData.name || !formData.email}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md disabled:opacity-50 transition-all mt-4"
            >
              Continue to Step 2 &rarr;
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Select Subscription Plan
              </label>
              <select
                value={formData.plan}
                onChange={(e) => setFormData({ ...formData, plan: e.target.value as PlanType })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="1 Month">1 Month Pass (₹7,500)</option>
                <option value="3 Months">3 Months Pro (₹19,500)</option>
                <option value="6 Months">6 Months Elite (₹36,000)</option>
                <option value="Custom">Custom Enterprise</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Assigned Head Trainer
              </label>
              <select
                value={formData.assignedTrainer}
                onChange={(e) => setFormData({ ...formData, assignedTrainer: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Aarav Sharma">Aarav Sharma (Personal Training)</option>
                <option value="Kavya Patel">Kavya Patel (Pilates & Yoga)</option>
                <option value="Arjun Nair">Arjun Nair (Physiotherapy)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={formData.heightCm}
                  onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={formData.currentWeightKg}
                  onChange={(e) => setFormData({ ...formData, currentWeightKg: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Complete Onboarding
              </button>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};
