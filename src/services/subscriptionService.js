/**
 *
 * @file subscriptionService.js
 * @path src/services/subscriptionService.js
 * @project Humidor Hub
 * @author Shawn Miller (hereiamnow@gmail.com)
 * @date Aug 3, 2025
 *
 * Description
 * Service class for managing user subscription tiers and feature access control.
 * Handles database operations for subscription data, enforces tier limits,
 * and provides utilities for checking feature availability. Manages AI usage
 * tracking, cigar limits, and CSV import permissions based on subscription tier.
 *
 */
import { doc, getDoc, setDoc, collection } from 'firebase/firestore';

export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  PREMIUM: 'premium'
};

export const SUBSCRIPTION_LIMITS = {
  [SUBSCRIPTION_TIERS.FREE]: {
    maxCigars: 50,
    csvImport: false,
    csvExport: true,
    aiLookups: 5, // per month
    features: ['basic_tracking', 'export_only', 'limited_ai']
  },
  [SUBSCRIPTION_TIERS.PREMIUM]: {
    maxCigars: -1, // unlimited
    csvImport: true,
    csvExport: true,
    aiLookups: 100, // per month
    features: ['unlimited_tracking', 'full_import_export', 'unlimited_ai', 'advanced_analytics']
  }
};

export class SubscriptionService {
  constructor(db, appId, userId) {
    console.log('[SubscriptionService] Constructor called with:', { appId, userId });
    this.db = db;
    this.appId = appId;
    this.userId = userId;
  }

  async getUserSubscription() {
    console.log('[SubscriptionService] Getting user subscription for userId:', this.userId);
    try {
      const userDocRef = doc(this.db, 'artifacts', this.appId, 'users', this.userId, 'subscription', 'current');
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const subscriptionData = userDoc.data();
        console.log('[SubscriptionService] Found existing subscription:', subscriptionData);
        return subscriptionData;
      }

      // Default to free tier for new users
      const defaultSubscription = {
        tier: SUBSCRIPTION_TIERS.FREE,
        status: 'active',
        aiLookupsUsed: 0,
        renewsOn: null,
        createdAt: new Date().toISOString()
      };
      console.log('[SubscriptionService] No subscription found, returning default:', defaultSubscription);
      return defaultSubscription;
    } catch (error) {
      console.error('[SubscriptionService] Error fetching subscription:', error);
      const fallbackSubscription = { tier: SUBSCRIPTION_TIERS.FREE, status: 'active', aiLookupsUsed: 0 };
      console.log('[SubscriptionService] Returning fallback subscription:', fallbackSubscription);
      return fallbackSubscription;
    }
  }

  async updateUserSubscription(subscriptionData) {
    console.log('[SubscriptionService] Updating user subscription for userId:', this.userId);
    try {
      const subDocRef = doc(this.db, 'artifacts', this.appId, 'users', this.userId, 'subscription', 'current');
      await setDoc(subDocRef, subscriptionData, { merge: true });
      console.log('[SubscriptionService] Subscription updated successfully.');
    } catch (error) {
      console.error('[SubscriptionService] Error updating subscription:', error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  async canAddCigar(currentCigarCount) {
    console.log('[SubscriptionService] Checking if can add cigar, current count:', currentCigarCount);
    const subscription = await this.getUserSubscription();
    const limits = SUBSCRIPTION_LIMITS[subscription.tier];
    const canAdd = limits.maxCigars === -1 || currentCigarCount < limits.maxCigars;

    console.log('[SubscriptionService] Can add cigar result:', {
      tier: subscription.tier,
      maxCigars: limits.maxCigars,
      currentCount: currentCigarCount,
      canAdd
    });

    return canAdd;
  }

  async canImportCSV() {
    console.log('[SubscriptionService] Checking CSV import permission');
    const subscription = await this.getUserSubscription();
    const canImport = SUBSCRIPTION_LIMITS[subscription.tier].csvImport;

    console.log('[SubscriptionService] CSV import result:', {
      tier: subscription.tier,
      canImport
    });

    return canImport;
  }

  async canUseAI() {
    console.log('[SubscriptionService] Checking AI usage permission');
    const subscription = await this.getUserSubscription();
    const limits = SUBSCRIPTION_LIMITS[subscription.tier];
    const canUse = subscription.aiLookupsUsed < limits.aiLookups;

    console.log('[SubscriptionService] AI usage result:', {
      tier: subscription.tier,
      aiLookupsUsed: subscription.aiLookupsUsed,
      aiLookupsLimit: limits.aiLookups,
      canUse
    });

    return canUse;
  }

  async incrementAIUsage() {
    console.log('[SubscriptionService] Incrementing AI usage');
    const subscription = await this.getUserSubscription();
    const oldUsage = subscription.aiLookupsUsed || 0;
    const newUsage = oldUsage + 1;

    console.log('[SubscriptionService] AI usage increment:', {
      oldUsage,
      newUsage,
      tier: subscription.tier
    });

    const subDocRef = doc(this.db, 'artifacts', this.appId, 'users', this.userId, 'subscription', 'current');
    await setDoc(subDocRef, { ...subscription, aiLookupsUsed: newUsage }, { merge: true });

    console.log('[SubscriptionService] AI usage updated in database');
  }

  getSubscriptionLimits(tier) {
    console.log('[SubscriptionService] Getting limits for tier:', tier);
    const limits = SUBSCRIPTION_LIMITS[tier] || SUBSCRIPTION_LIMITS[SUBSCRIPTION_TIERS.FREE];
    console.log('[SubscriptionService] Limits result:', limits);
    return limits;
  }
}