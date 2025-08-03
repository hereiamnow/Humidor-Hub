/**
 *
 * @file SubscriptionGuard.jsx
 * @path src/components/Subscription/SubscriptionGuard.jsx
 * @project Humidor Hub
 * @author Shawn Miller (hereiamnow@gmail.com)
 * @date Aug 3, 2025
 *
 * Description
 * A guard component that conditionally renders content based on subscription tier.
 * Protects premium features by showing upgrade prompts for free tier users.
 * Supports custom fallback content, messages, and configurable upgrade buttons.
 * Integrates with SubscriptionContext to check user's subscription status.
 *
 */

import React from 'react';
import { Crown, Lock } from 'lucide-react';
import { useSubscription } from '../../contexts/SubscriptionContext';

const SubscriptionGuard = ({
  feature,
  children,
  fallback,
  showUpgrade = true,
  customMessage
}) => {
  const { isPremium, isFree } = useSubscription();

  const featureRequiresPremium = {
    csvImport: true,
    unlimitedCigars: true,
    advancedAnalytics: true
  };

  const needsPremium = featureRequiresPremium[feature];

  if (needsPremium && isFree) {
    if (fallback) return fallback;

    return (
      <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4 text-center">
        <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <h3 className="font-semibold text-gray-300 mb-2">Premium Feature</h3>
        <p className="text-sm text-gray-400 mb-3">
          {customMessage || 'This feature requires a Premium subscription.'}
        </p>
        {showUpgrade && (
          <button
            className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2 mx-auto"
            onClick={() => window.open('https://play.google.com/store/account/subscriptions', '_blank')}
          >
            <Crown className="w-4 h-4" />
            Upgrade to Premium
          </button>
        )}
      </div>
    );
  }

  return children;
};

export default SubscriptionGuard;