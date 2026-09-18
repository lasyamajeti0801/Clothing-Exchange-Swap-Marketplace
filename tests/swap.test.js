import { describe, it, expect } from 'vitest';
import { calculateEstimatedValue, compareSwapItems } from '../server/src/services/valuationService.js';
import {
  SWAP_STATUSES,
  isValidTransition,
  canUserPerformTransition,
} from '../server/src/services/swapStateMachine.js';

describe('ReWear Valuation Engine', () => {
  it('should calculate realistic estimated values with brand and condition factors', () => {
    const result = calculateEstimatedValue({
      category: 'Jackets',
      brand: "Levi's",
      condition: 'LIKE_NEW',
      purchaseAge: '< 6 months',
      material: 'Denim',
    });

    expect(result.estimatedValue).toBeGreaterThan(1500);
    expect(result.suggestedRange.min).toBeLessThan(result.estimatedValue);
    expect(result.suggestedRange.max).toBeGreaterThan(result.estimatedValue);
    expect(result.disclaimer).toBeDefined();
  });

  it('should evaluate swap fairness comparison between two items', () => {
    const itemA = { estimatedValue: 1500, title: 'Denim Jacket' };
    const itemB = { estimatedValue: 1450, title: 'Cotton Hoodie' };

    const comparison = compareSwapItems(itemA, itemB);
    expect(comparison.fairnessCategory).toBe('Close Match');
    expect(comparison.percentageDifference).toBeLessThanOrEqual(15);
  });

  it('should categorize large difference when value gap exceeds 35%', () => {
    const itemA = { estimatedValue: 3000, title: 'Silk Saree' };
    const itemB = { estimatedValue: 800, title: 'Basic T-Shirt' };

    const comparison = compareSwapItems(itemA, itemB);
    expect(comparison.fairnessCategory).toBe('Large Difference');
    expect(comparison.percentageDifference).toBeGreaterThan(35);
  });
});

describe('Swap Request State Machine', () => {
  it('should allow valid transitions: PENDING -> ACCEPTED -> READY_FOR_EXCHANGE -> COMPLETED', () => {
    expect(isValidTransition(SWAP_STATUSES.PENDING, SWAP_STATUSES.ACCEPTED)).toBe(true);
    expect(isValidTransition(SWAP_STATUSES.ACCEPTED, SWAP_STATUSES.READY_FOR_EXCHANGE)).toBe(true);
    expect(isValidTransition(SWAP_STATUSES.READY_FOR_EXCHANGE, SWAP_STATUSES.COMPLETED)).toBe(true);
  });

  it('should disallow invalid transitions like COMPLETED -> PENDING or REJECTED -> ACCEPTED', () => {
    expect(isValidTransition(SWAP_STATUSES.COMPLETED, SWAP_STATUSES.PENDING)).toBe(false);
    expect(isValidTransition(SWAP_STATUSES.REJECTED, SWAP_STATUSES.ACCEPTED)).toBe(false);
    expect(isValidTransition(SWAP_STATUSES.CANCELLED, SWAP_STATUSES.NEGOTIATING)).toBe(false);
  });

  it('should enforce user participant role authorization', () => {
    const senderId = 'user-1';
    const receiverId = 'user-2';
    const outsiderId = 'user-99';

    // Outsider cannot accept
    expect(
      canUserPerformTransition({
        currentStatus: SWAP_STATUSES.PENDING,
        targetStatus: SWAP_STATUSES.ACCEPTED,
        userId: outsiderId,
        senderId,
        receiverId,
        role: 'USER',
      })
    ).toBe(false);

    // Only receiver can accept initial PENDING request
    expect(
      canUserPerformTransition({
        currentStatus: SWAP_STATUSES.PENDING,
        targetStatus: SWAP_STATUSES.ACCEPTED,
        userId: senderId,
        senderId,
        receiverId,
        role: 'USER',
      })
    ).toBe(false);

    expect(
      canUserPerformTransition({
        currentStatus: SWAP_STATUSES.PENDING,
        targetStatus: SWAP_STATUSES.ACCEPTED,
        userId: receiverId,
        senderId,
        receiverId,
        role: 'USER',
      })
    ).toBe(true);

    // Admin can always perform transitions
    expect(
      canUserPerformTransition({
        currentStatus: SWAP_STATUSES.PENDING,
        targetStatus: SWAP_STATUSES.ACCEPTED,
        userId: outsiderId,
        senderId,
        receiverId,
        role: 'ADMIN',
      })
    ).toBe(true);
  });
});
