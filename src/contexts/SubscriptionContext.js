/**
 *
 * @file SubscriptionContext.js
 * @path src/contexts/SubscriptionContext.js
 * @project Humidor Hub
 * @author Shawn Miller (hereiamnow@gmail.com)
 * @date Aug 3, 2025
 *
 * Description
 * React context provider for managing subscription state throughout the application.
 * Provides subscription data, tier checking utilities, and refresh functionality.
 * Integrates with SubscriptionService to handle database operations and maintains
 * real-time subscription status for premium feature access control.
 *
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { SubscriptionService, SUBSCRIPTION_TIERS } from '../services/subscriptionService';

const SubscriptionContext = createContext();

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  console.log('[SubscriptionContext] useSubscription called, context:', context);
  if (!context) {
    console.error('[SubscriptionContext] useSubscription called outside of provider');
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children, db, appId, userId }) => {
  console.log('[SubscriptionProvider] Provider initialized with:', { appId, userId, hasDb: !!db });
  const [subscription, setSubscription] = useState(null);
  const [subscriptionService, setSubscriptionService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[SubscriptionProvider] useEffect triggered with:', { hasDb: !!db, appId, userId });
    if (db && appId && userId) {
      console.log('[SubscriptionProvider] Creating SubscriptionService');
      const service = new SubscriptionService(db, appId, userId);
      setSubscriptionService(service);

      // Load initial subscription data
      console.log('[SubscriptionProvider] Loading initial subscription data');
      service.getUserSubscription().then(sub => {
        console.log('[SubscriptionProvider] Initial subscription loaded:', sub);
        setSubscription(sub);
        setLoading(false);
        console.log('[SubscriptionProvider] Loading complete');
      }).catch(error => {
        console.error('[SubscriptionProvider] Error loading subscription:', error);
        setLoading(false);
      });
    } else {
      console.log('[SubscriptionProvider] Missing required props, not initializing service');
    }
  }, [db, appId, userId]);

  const refreshSubscription = async () => {
    console.log('[SubscriptionProvider] refreshSubscription called');
    if (subscriptionService) {
      console.log('[SubscriptionProvider] Refreshing subscription data');
      const sub = await subscriptionService.getUserSubscription();
      console.log('[SubscriptionProvider] Refreshed subscription:', sub);
      setSubscription(sub);
    } else {
      console.log('[SubscriptionProvider] No subscription service available for refresh');
    }
  };

  const setDevelopmentTier = (tier) => {
    const isDevelopment = process.env.NODE_ENV === 'development' ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    if (isDevelopment) {
      console.log('[SubscriptionProvider] Setting development tier to:', tier);
      // Update the subscription state for development
      setSubscription(prev => ({
        ...prev,
        tier: tier,
        status: 'active', // Ensure status is active for testing
        // Reset usage for testing
        aiLookupsUsed: 0,
        // Add renew date for premium testing
        renewsOn: tier === SUBSCRIPTION_TIERS.PREMIUM ?
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString() :
          undefined
      }));
    }
  };

  const isPremium = subscription?.tier === SUBSCRIPTION_TIERS.PREMIUM;
  const isFree = subscription?.tier === SUBSCRIPTION_TIERS.FREE;

  // const saveDevelopmentTier = async (tier) => {
  //   const isDevelopment = process.env.NODE_ENV === 'development' ||
  //     window.location.hostname === 'localhost' ||
  //     window.location.hostname === '127.0.0.1';

  //   if (isDevelopment && subscriptionService) {
  //     console.log('[SubscriptionProvider] Saving development tier to:', tier);
  //     try {
  //       const newSubData = {
  //         ...subscription,
  //         tier: tier,
  //         status: 'active',
  //         aiLookupsUsed: 0,
  //         renewsOn: tier === SUBSCRIPTION_TIERS.PREMIUM ?
  //           new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString() :
  //           null
  //       };
  //       await subscriptionService.updateUserSubscription(newSubData);
  //       setSubscription(newSubData);
  //       console.log('[SubscriptionProvider] Development tier saved and local state updated.');
  //     } catch (error) {
  //       console.error('[SubscriptionProvider] Error saving development tier:', error);
  //     }
  //   }
  // };



  /**
   * Saves the development tier to Firestore.
   * This function is intended for development/testing purposes only.
   * @param {string} newTier - The new subscription tier to set.
   */
  const saveDevelopmentTier = async (newTier) => {
    if (!userId || !db || !appId) {
      console.error("Cannot save development tier: missing userId, db, or appId.");
      return;
    }

    try {
      // 1. Update the subscription document
      const subscriptionRef = doc(db, 'users', userId, 'subscriptions', appId);
      await updateDoc(subscriptionRef, {
        tier: newTier,
        aiLookupsUsed: 0, // Reset usage when tier changes
        // You might want to clear or adjust other fields when toggling
        // status: 'active', 
        // updatedAt: serverTimestamp(),
      });

      // 2. Update the 'isPremium' field on the parent user document
      const userRef = doc(db, 'users', userId);
      const isPremium = newTier === SUBSCRIPTION_TIERS.PREMIUM;
      await updateDoc(userRef, {
        isPremium: isPremium,
        aiLookupsUsed: 0 // Also reset usage on the user document
      });

      console.log(`Successfully set development tier to ${newTier} and updated user document.`);

      // The local state will update automatically via the onSnapshot listener.

    } catch (error) {
      console.error("Error saving development tier:", error);
    }
  };



  const value = {
    subscription,
    subscriptionService,
    isPremium,
    isFree,
    loading,
    refreshSubscription,
    setDevelopmentTier,
    saveDevelopmentTier
  };

  console.log('[SubscriptionProvider] Context value updated:', {
    hasSubscription: !!subscription,
    tier: subscription?.tier,
    isPremium,
    isFree,
    loading,
    hasService: !!subscriptionService
  });

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};