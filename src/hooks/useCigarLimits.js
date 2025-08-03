/**
 *
 * @file useCigarLimits.js
 * @path src/hooks/useCigarLimits.js
 * @project Humidor Hub
 * @author Shawn Miller (hereiamnow@gmail.com)
 * @date July 1, 2025
 *
 * Description
 * Custom React hook for managing cigar storage limits based on subscription tier.
 * Calculates remaining slots, determines if users can add more cigars, and provides
 * limit status indicators. Integrates with SubscriptionContext to enforce tier-based
 * restrictions and returns utilities for limit checking and warning displays.
 *
 */
import { useState, useEffect } from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';
import { SUBSCRIPTION_LIMITS } from '../services/subscriptionService';

export const useCigarLimits = (cigars = []) => {
  console.log('[useCigarLimits] Hook called with cigars count:', cigars.length);
  const { subscription, isFree, isPremium } = useSubscription();
  const [canAddCigar, setCanAddCigar] = useState(true);
  const [remainingSlots, setRemainingSlots] = useState(null);

  console.log('[useCigarLimits] Subscription context values:', {
    subscription,
    isFree,
    isPremium
  });

  useEffect(() => {
    console.log('[useCigarLimits] useEffect triggered, subscription:', subscription);
    if (!subscription) {
      console.log('[useCigarLimits] No subscription found, returning early');
      return;
    }

    const limits = SUBSCRIPTION_LIMITS[subscription.tier];
    const currentCount = cigars.length;

    console.log('[useCigarLimits] Calculating limits:', {
      tier: subscription.tier,
      limits,
      currentCount
    });

    if (limits.maxCigars === -1) {
      // Unlimited for premium
      console.log('[useCigarLimits] Premium tier - unlimited cigars');
      setCanAddCigar(true);
      setRemainingSlots(null);
    } else {
      // Limited for free tier
      const remaining = limits.maxCigars - currentCount;
      console.log('[useCigarLimits] Free tier - limited cigars:', {
        maxCigars: limits.maxCigars,
        currentCount,
        remaining,
        canAdd: remaining > 0
      });
      setCanAddCigar(remaining > 0);
      setRemainingSlots(remaining);
    }
  }, [subscription, cigars.length]);

  const returnValue = {
    canAddCigar,
    remainingSlots,
    isAtLimit: remainingSlots === 0,
    isNearLimit: remainingSlots !== null && remainingSlots <= 10,
    maxCigars: subscription ? SUBSCRIPTION_LIMITS[subscription.tier].maxCigars : 50
  };

  console.log('[useCigarLimits] Returning values:', returnValue);
  return returnValue;
};