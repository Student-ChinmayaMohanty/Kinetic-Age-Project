import React from 'react';
import { useApp } from '../../context/AppContext';
import { CircularProgressRing } from '../common/CircularProgressRing';
import { Badge } from '../common/Badge';
import { CheckCircle2, RefreshCw, ShieldCheck } from 'lucide-react';

export const SubscriptionsView: React.FC = () => {
  const { subscriptions, renewSubscription, setIsAddClientOpen } = useApp();

  const planTiers = [
    { name: '1 Month Pass', price: '₹7,500', duration: '30 Days', badge: 'Flexible', color: 'from-blue-600 to-indigo-600', perks: ['Personal Training 2x/wk', 'Locker Room Access', 'App Workout Sync'] },
    { name: '3 Months Pro', price: '₹19,500', duration: '90 Days', badge: 'Most Popular', color: 'from-indigo-600 to-purple-600', perks: ['Unlimited PT Sessions', 'Bi-weekly Nutritionist Call', 'Body Comp Analysis', 'Priority Slot Booking'] },
    { name: '6 Months Elite', price: '₹36,000', duration: '180 Days', badge: 'Best Value', color: 'from-purple-600 to-pink-600', perks: ['All Pro Benefits Included', 'Physiotherapy Assessment', 'Recovery Sauna Sessions', '1-on-1 Head Coach Access'] },
    { name: 'Custom Enterprise', price: 'Custom', duration: 'Flexible', badge: 'Clinic / Studio', color: 'from-slate-800 to-slate-900', perks: ['Multi-trainer Allocation', 'Corporate Group Billing', 'Custom EHR Integration'] }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Subscription Management & Tiers
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Monitor plan lifecycle, automated expiry alerts, and membership renewal velocity
          </p>
        </div>

        <button
          onClick={() => setIsAddClientOpen(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20"
        >
          + Assign New Plan
        </button>
      </div>

      {/* Plan Tier Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {planTiers.map((tier) => (
          <div
            key={tier.name}
            className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 transition-all duration-200"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{tier.duration}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                  {tier.badge}
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mb-1">{tier.name}</h3>
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mb-4">{tier.price}</div>

              <div className="space-y-2 border-t border-gray-100 dark:border-gray-800 pt-3 mb-4">
                {tier.perks.map((perk) => (
                  <div key={perk} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Subscriptions Ledger */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 shadow-xs">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          Active Subscriptions & Expiry Matrix
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subscriptions.map((sub) => {
            const pct = Math.round((sub.remainingDays / sub.totalDays) * 100);
            const isExpiringSoon = sub.remainingDays <= 5;

            return (
              <div
                key={sub.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isExpiringSoon
                    ? 'bg-amber-500/5 border-amber-500/30 dark:bg-amber-950/20'
                    : 'bg-gray-50/70 dark:bg-gray-800/40 border-gray-200/80 dark:border-gray-800'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">{sub.clientName}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{sub.planName} • ₹{sub.price.toLocaleString('en-IN')}</p>
                  </div>

                  {/* Circular SVG Ring showing Days Remaining */}
                  <CircularProgressRing
                    progressPct={pct}
                    size={56}
                    strokeWidth={5}
                    color={isExpiringSoon ? '#F59E0B' : '#2563EB'}
                    label={`${sub.remainingDays}d`}
                    subtext="left"
                  />
                </div>

                <div className="space-y-1.5 text-xs text-gray-500 dark:text-gray-400 mb-4 font-mono">
                  <div className="flex justify-between">
                    <span>Start:</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">{sub.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expiration:</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">{sub.endDate}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200/60 dark:border-gray-700/60 pt-3">
                  <Badge variant={sub.status === 'Active' ? 'success' : sub.status === 'Pending Renewal' ? 'warning' : 'danger'}>
                    {sub.status}
                  </Badge>

                  <button
                    onClick={() => renewSubscription(sub.id)}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Renew Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
