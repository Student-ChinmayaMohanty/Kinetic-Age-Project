import React from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import type { PaymentMethod } from '../../types';
import { 
  PlusCircle, Printer, CreditCard, 
  Smartphone, Wallet, Building2 
} from 'lucide-react';

export const PaymentsView: React.FC = () => {
  const { 
    payments, 
    setIsAddPaymentOpen, 
    selectedInvoice,
    setSelectedInvoice
  } = useApp();

  const totalCollected = payments.reduce((acc, p) => acc + p.paidAmount, 0);
  const totalDue = payments.reduce((acc, p) => acc + p.dueAmount, 0);

  const getMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'UPI': return <Smartphone className="w-3.5 h-3.5 text-indigo-500" />;
      case 'Credit Card': return <CreditCard className="w-3.5 h-3.5 text-blue-500" />;
      case 'Cash': return <Wallet className="w-3.5 h-3.5 text-emerald-500" />;
      case 'Bank Transfer': return <Building2 className="w-3.5 h-3.5 text-purple-500" />;
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Payments & Revenue Ledger
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Track multi-installment payment timelines, invoice generation, and settlement compliance
          </p>
        </div>

        <button
          onClick={() => setIsAddPaymentOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Log New Payment
        </button>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Collected</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">₹{totalCollected.toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-gray-500 mt-1 block">96% collection velocity</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Pending Balance</span>
          <div className="text-2xl font-black text-amber-500 mt-1">₹{totalDue.toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-gray-500 mt-1 block">Installments scheduled</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Accepted Gateways</span>
          <div className="flex items-center gap-2 mt-2">
            {['UPI', 'Credit Card', 'Cash', 'Bank Transfer'].map((m) => (
              <span key={m} className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-[11px] font-bold text-gray-700 dark:text-gray-300">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Ledger Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Transaction History</h3>
          <span className="text-xs font-semibold text-gray-400">{payments.length} transactions recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-800 text-gray-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Invoice No</th>
                <th className="p-4">Client Name</th>
                <th className="p-4">Plan / Service</th>
                <th className="p-4">Paid / Total Amount</th>
                <th className="p-4">Installment Timeline</th>
                <th className="p-4">Gateway</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Invoice</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {payments.map((p) => {
                const paidPct = Math.round((p.paidAmount / p.amount) * 100);

                return (
                  <tr key={p.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {p.invoiceNo}
                    </td>

                    <td className="p-4 font-bold text-gray-900 dark:text-white">
                      {p.clientName}
                    </td>

                    <td className="p-4 text-gray-700 dark:text-gray-300 font-medium">
                      {p.planName}
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-gray-900 dark:text-white">₹{p.paidAmount.toLocaleString('en-IN')}</span>
                      <span className="text-gray-400"> / ₹{p.amount.toLocaleString('en-IN')}</span>
                    </td>

                    <td className="p-4 w-48">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden mb-1">
                        <div
                          className={`h-full rounded-full ${paidPct === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                          style={{ width: `${paidPct}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-400 font-semibold">{paidPct}% settled</span>
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold">
                        {getMethodIcon(p.method)}
                        {p.method}
                      </span>
                    </td>

                    <td className="p-4">
                      <Badge variant={p.status === 'Paid' ? 'success' : p.status === 'Partial' ? 'warning' : 'danger'}>
                        {p.status}
                      </Badge>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedInvoice(p)}
                        className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs flex items-center gap-1.5 ml-auto"
                      >
                        <Printer className="w-3.5 h-3.5" /> Receipt
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice / Receipt Preview Modal */}
      {selectedInvoice && (
        <Modal
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          maxWidth="xl"
        >
          <div id="printable-invoice" className="print-only-modal p-6 space-y-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
              <div>
                <h2 className="text-xl font-black tracking-tight text-blue-600 dark:text-blue-400">KineticOS Invoice</h2>
                <p className="text-xs text-gray-500">Apex Fitness & Wellness Center - Mumbai</p>
              </div>
              <div className="text-right font-mono text-xs">
                <span className="font-bold block">{selectedInvoice.invoiceNo}</span>
                <span className="text-gray-400">Date: {selectedInvoice.date}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-bold uppercase text-gray-400 block mb-1">Billed To</span>
                <p className="font-bold text-sm">{selectedInvoice.clientName}</p>
                <p className="text-gray-500">Client ID: {selectedInvoice.clientId}</p>
              </div>
              <div className="text-right">
                <span className="font-bold uppercase text-gray-400 block mb-1">Payment Method</span>
                <p className="font-bold text-sm">{selectedInvoice.method}</p>
                <p className="text-emerald-500 font-semibold">Status: {selectedInvoice.status}</p>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 font-bold uppercase">
                  <tr>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  <tr>
                    <td className="p-3 font-semibold">{selectedInvoice.planName}</td>
                    <td className="p-3 text-right font-mono font-bold">₹{selectedInvoice.amount.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center text-sm font-bold pt-2 border-t border-gray-200 dark:border-gray-800">
              <span>Total Paid Amount:</span>
              <span className="text-lg text-emerald-600 dark:text-emerald-400 font-mono">₹{selectedInvoice.paidAmount.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-end gap-3 pt-4 print:hidden">
              <button
                onClick={handlePrintInvoice}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print Receipt / Download PDF
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
