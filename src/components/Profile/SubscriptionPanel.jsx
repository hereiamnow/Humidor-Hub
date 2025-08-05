import React from 'react';
import { Zap, Crown, Lock } from 'lucide-react';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { SUBSCRIPTION_LIMITS, SUBSCRIPTION_TIERS } from '../../services/subscriptionService';

const SubscriptionPanel = ({ subscription: propSubscription }) => {
    const { subscription: contextSubscription, isPremium, isFree, setDevelopmentTier, saveDevelopmentTier } = useSubscription();
    console.log('SubscriptionPanel: context values', { contextSubscription, isPremium, isFree, hasSaveDevelopmentTier: !!saveDevelopmentTier });

    // Use context subscription if available, otherwise fall back to prop
    const subscription = contextSubscription || propSubscription;
    console.log('SubscriptionPanel: effective subscription', subscription);

    if (!subscription) return null;

    const limits = SUBSCRIPTION_LIMITS[subscription.tier];
    const tierColor = isPremium ? 'from-amber-500/20 to-yellow-500/20' : 'from-gray-500/20 to-slate-500/20';
    const borderColor = isPremium ? 'border-amber-400/50' : 'border-gray-400/50';
    const badgeColor = isPremium ? 'bg-amber-400 text-black' : 'bg-gray-400 text-white';
    const icon = isPremium ? Crown : Lock;

    return (
        <div id="pnlSubscription" className={`bg-gradient-to-r ${tierColor} p-4 rounded-md border ${borderColor} shadow-lg`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-amber-200 text-lg flex items-center">
                    {React.createElement(icon, { className: "w-5 h-5 mr-2" })} Subscription
                </h3>
                <span className={`px-3 py-1 text-xs font-bold ${badgeColor} rounded-full uppercase`}>
                    {subscription.tier}
                </span>
            </div>
            <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-300">Status:</span>
                    <span className="font-semibold text-green-400">{subscription.status}</span>
                </div>

                {isPremium && subscription.renewsOn && (
                    <div className="flex justify-between">
                        <span className="text-gray-300">Renews on:</span>
                        <span className="font-semibold text-white">{subscription.renewsOn}</span>
                    </div>
                )}

                <div>
                    <div className="flex justify-between mb-1">
                        <span className="text-gray-300">AI Lookups this month:</span>
                        <span className="font-semibold text-white">
                            {subscription.aiLookupsUsed || 0} / {limits.aiLookups}
                        </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-amber-500 h-2 rounded-full"
                            style={{ width: `${((subscription.aiLookupsUsed || 0) / limits.aiLookups) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {isFree && (
                    <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
                        <h4 className="font-semibold text-amber-300 mb-2">Free Tier Limits:</h4>
                        <ul className="text-xs text-gray-300 space-y-1">
                            <li>• Max {limits.maxCigars} cigars</li>
                            <li>• Export only (no CSV import)</li>
                            <li>• {limits.aiLookups} AI lookups per month</li>
                        </ul>
                    </div>
                )}
            </div>
            {/* 
            for a direct link to your app's subscription:
            https://play.google.com/store/account/subscriptions?sku=YOUR_SUBSCRIPTION_ID&package=YOUR_APP_PACKAGE 
            */}
            <button
                className={`mt-4 w-full font-bold py-2 rounded-lg transition-colors ${isFree
                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                    : 'bg-gray-600 text-white hover:bg-gray-500'
                    }`}
                onClick={() => window.open('https://play.google.com/store/account/subscriptions', '_blank')}
            >
                {isFree ? 'Upgrade to Premium' : 'Manage Subscription'}
            </button>




            {/* Development Mode Toggle */}
            {(process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (
                <div className="mt-4 pt-4 border-t border-gray-600">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Dev Mode: Toggle Tier</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={isPremium}
                                onChange={(e) => {
                                    const newTier = e.target.checked ? SUBSCRIPTION_TIERS.PREMIUM : SUBSCRIPTION_TIERS.FREE;
                                    console.log('SubscriptionPanel: Toggling dev tier to', newTier);
                                    setDevelopmentTier(newTier);
                                    if (saveDevelopmentTier) {
                                        console.log('SubscriptionPanel: Calling saveDevelopmentTier...');
                                        saveDevelopmentTier(newTier);
                                    } else {
                                        console.error('SubscriptionPanel: saveDevelopmentTier function is not available on the context.');
                                    }
                                }}
                            />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                        </label>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        Current: {isPremium ? 'Premium' : 'Free'}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubscriptionPanel;