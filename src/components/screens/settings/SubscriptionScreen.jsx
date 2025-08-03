import React from 'react';
import { ChevronLeft, Crown, Check, X } from 'lucide-react';
import { useSubscription } from '../../../contexts/SubscriptionContext';
import { SUBSCRIPTION_LIMITS } from '../../../services/subscriptionService';

const SubscriptionScreen = ({ navigate, theme }) => {
  const { subscription, isPremium, isFree } = useSubscription();

  const features = [
    {
      name: 'Cigar Storage',
      free: '50 cigars max',
      premium: 'Unlimited cigars',
      icon: '🚬'
    },
    {
      name: 'CSV Import',
      free: false,
      premium: true,
      icon: '📥'
    },
    {
      name: 'CSV Export',
      free: true,
      premium: true,
      icon: '📤'
    },
    {
      name: 'AI Auto-fill',
      free: '5 per month',
      premium: '100 per month',
      icon: '🤖'
    },
    {
      name: 'Advanced Analytics',
      free: false,
      premium: true,
      icon: '📊'
    },
    {
      name: 'Priority Support',
      free: false,
      premium: true,
      icon: '🎧'
    }
  ];

  const renderFeatureValue = (value) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-green-400" />
      ) : (
        <X className="w-5 h-5 text-red-400" />
      );
    }
    return <span className="text-sm">{value}</span>;
  };

  return (
    <div className="p-4 pb-24">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate('Settings')} className="p-2 -ml-2 mr-2">
          <ChevronLeft className="w-7 h-7 text-white" />
        </button>
        <h1 className="text-3xl font-bold text-white">Subscription</h1>
      </div>

      {/* Current Plan */}
      <div className={`p-4 rounded-lg mb-6 ${
        isPremium 
          ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/50' 
          : 'bg-gray-800/50 border border-gray-600'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {isPremium ? <Crown className="w-5 h-5 text-amber-400" /> : null}
            Current Plan: {subscription?.tier?.toUpperCase() || 'FREE'}
          </h2>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            isPremium ? 'bg-amber-400 text-black' : 'bg-gray-600 text-white'
          }`}>
            {subscription?.status || 'Active'}
          </span>
        </div>
        
        {subscription && (
          <div className="text-sm text-gray-300">
            {isPremium && subscription.renewsOn && (
              <p>Renews on: {subscription.renewsOn}</p>
            )}
            <p>AI Lookups used: {subscription.aiLookupsUsed || 0} / {SUBSCRIPTION_LIMITS[subscription.tier]?.aiLookups || 5}</p>
          </div>
        )}
      </div>

      {/* Feature Comparison */}
      <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-bold text-white mb-4">Feature Comparison</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 pb-2 border-b border-gray-600">
            <div className="font-semibold text-gray-300">Feature</div>
            <div className="font-semibold text-gray-300 text-center">Free</div>
            <div className="font-semibold text-amber-300 text-center">Premium</div>
          </div>
          
          {features.map((feature, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 items-center">
              <div className="flex items-center gap-2 text-white">
                <span>{feature.icon}</span>
                <span className="text-sm">{feature.name}</span>
              </div>
              <div className="text-center">
                {renderFeatureValue(feature.free)}
              </div>
              <div className="text-center">
                {renderFeatureValue(feature.premium)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {isFree && (
          <button 
            className="w-full bg-amber-500 text-white font-bold py-3 rounded-lg hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
            onClick={() => window.open('https://play.google.com/store/account/subscriptions', '_blank')}
          >
            <Crown className="w-5 h-5" />
            Upgrade to Premium
          </button>
        )}
        
        <button 
          className="w-full bg-gray-600 text-white font-bold py-3 rounded-lg hover:bg-gray-500 transition-colors"
          onClick={() => window.open('https://play.google.com/store/account/subscriptions', '_blank')}
        >
          Manage Subscription
        </button>
      </div>
    </div>
  );
};

export default SubscriptionScreen;