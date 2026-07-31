import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import type { PaymentMethod } from '../../types';

export const AddPaymentModal: React.FC = () => {
  const { 
    isAddPaymentOpen, 
    setIsAddPaymentOpen, 
    clients, 
    recordPayment,
    hasPermission,
    currentUser,
    switchRole,
    addToast
  } = useApp();

  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const [planName, setPlanName] = useState<string>('3 Months Pro');
  const [amount, setAmount] = useState<number>(19500);
  const [paidAmount, setPaidAmount] = useState<number>(19500);
  const [method, setMethod] = useState<PaymentMethod>('UPI');

  const canLogPayment = hasPermission('log_payment');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!canLogPayment) {
      addToast('Permission Required', 'You must be a Super Admin or Center Manager to record payments.', 'warning');
      return;
    }

    const client = clients.find(c => c.id === selectedClientId) || clients[0];

    recordPayment({
      clientId: client?.id || selectedClientId,
      clientName: client?.name || 'Selected Client',
      planName,
      amount,
      paidAmount,
      method
    });

    setIsAddPaymentOpen(false);
  };

  const handleQuickElevateRole = () => {
    switchRole('Super Admin');
  };

  return (
    <Modal
      isOpen={isAddPaymentOpen}
      onClose={() => setIsAddPaymentOpen(false)}
      title="Log Payment Transaction"
      subtitle="Record member fee collection, installment settlement, and receipt generation"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {!canLogPayment && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Current role (<strong>{currentUser.role}</strong>) cannot log payments.</span>
            </div>
            <button
              type="button"
              onClick={handleQuickElevateRole}
              className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] whitespace-nowrap shadow-xs"
            >
              Switch to Admin
            </button>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
            Select Member / Client *
          </label>
          <select
            value={selectedClientId}
            onChange={(e) => {
              setSelectedClientId(e.target.value);
              const found = clients.find(c => c.id === e.target.value);
              if (found) {
                setPlanName(`${found.plan} Pass`);
              }
            }}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.id}) — {c.plan} [{c.status}]
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
            Membership Plan / Service Tier
          </label>
          <select
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="1 Month Pass">1 Month Pass (₹7,500)</option>
            <option value="3 Months Pro">3 Months Pro (₹19,500)</option>
            <option value="6 Months Elite">6 Months Elite (₹36,000)</option>
            <option value="Personal Training Package">Personal Training Package (₹15,000)</option>
            <option value="Physiotherapy Rehab Session">Physiotherapy Rehab Session (₹3,500)</option>
            <option value="Custom Plan">Custom Plan</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Total Invoice Amount (₹)
            </label>
            <input
              type="number"
              required
              min={1}
              value={amount}
              onChange={(e) => {
                const val = Number(e.target.value);
                setAmount(val);
                if (paidAmount > val) setPaidAmount(val);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Amount Paid Today (₹)
            </label>
            <input
              type="number"
              required
              min={0}
              max={amount}
              value={paidAmount}
              onChange={(e) => setPaidAmount(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
            Payment Gateway / Method
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['UPI', 'Credit Card', 'Cash', 'Bank Transfer'] as const).map((m) => (
              <button
                type="button"
                key={m}
                onClick={() => setMethod(m)}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  method === m
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                {m}
              </button>
            ))}
          </div>
        </div>

        {amount > paidAmount && (
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[11px] font-medium flex items-center justify-between">
            <span>Scheduled Remaining Installment:</span>
            <strong className="font-mono text-xs font-bold">₹{(amount - paidAmount).toLocaleString('en-IN')}</strong>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={() => setIsAddPaymentOpen(false)}
            className="w-1/3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-2/3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Record Payment
          </button>
        </div>
      </form>
    </Modal>
  );
};
