/**
 *
 * @file CigarLimitWarning.jsx
 * @path src/components/Subscription/CigarLimitWarning.jsx
 * @project Humidor Hub
 * @author Shawn Miller (hereiamnow@gmail.com)
 * @date July 1, 2025
 *
 * Description
 * A warning component that displays when users approach or reach their cigar storage limit
 * on the free tier. Shows remaining slots, warning messages, and provides an upgrade button
 * to Premium subscription. Integrates with the SubscriptionContext to check tier limits
 * and displays appropriate styling based on proximity to the limit.
 *
 */
import React from 'react';
import { AlertTriangle, Crown } from 'lucide-react';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { SUBSCRIPTION_LIMITS } from '../../services/subscriptionService';

const CigarLimitWarning = ({ currentCount, onUpgrade }) => {
  const { subscription, isFree } = useSubscription();

  if (!isFree || !subscription) return null;

  const limits = SUBSCRIPTION_LIMITS[subscription.tier];
  const remaining = limits.maxCigars - currentCount;
  const isNearLimit = remaining <= 10;
  const isAtLimit = remaining <= 0;

  if (!isNearLimit) return null;

  return (
    <div className={`p-3 rounded-lg border ${isAtLimit
        ? 'bg-red-900/20 border-red-500/50 text-red-300'
        : 'bg-amber-900/20 border-amber-500/50 text-amber-300'
      }`}>
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-4 h-4" />
        <span className="font-semibold">
          {isAtLimit ? 'Cigar Limit Reached' : 'Approaching Limit'}
        </span>
      </div>

      <p className="text-sm mb-3">
        {isAtLimit
          ? `You've reached your limit of ${limits.maxCigars} cigars. Upgrade to Premium for unlimited storage.`
          : `You have ${remaining} cigar slots remaining out of ${limits.maxCigars}.`
        }
      </p>

      <button
        onClick={onUpgrade}
        className="bg-amber-500 text-white px-3 py-1 rounded text-sm hover:bg-amber-600 transition-colors flex items-center gap-1"
      >
        <Crown className="w-3 h-3" />
        Upgrade to Premium
      </button>
    </div>
  );
};

export default CigarLimitWarning;