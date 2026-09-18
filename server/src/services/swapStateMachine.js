/**
 * Swap Request State Machine
 * Validates state transitions, enforces participant authorization, and manages listing status side-effects
 */

export const SWAP_STATUSES = {
  PENDING: 'PENDING',
  NEGOTIATING: 'NEGOTIATING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
  SHIPPING: 'SHIPPING',
  READY_FOR_EXCHANGE: 'READY_FOR_EXCHANGE',
  COMPLETED: 'COMPLETED',
  DISPUTED: 'DISPUTED',
  EXPIRED: 'EXPIRED',
};

// Allowed transitions mapping: fromState -> [validToStates]
const ALLOWED_TRANSITIONS = {
  [SWAP_STATUSES.PENDING]: [
    SWAP_STATUSES.NEGOTIATING,
    SWAP_STATUSES.ACCEPTED,
    SWAP_STATUSES.REJECTED,
    SWAP_STATUSES.CANCELLED,
    SWAP_STATUSES.EXPIRED,
  ],
  [SWAP_STATUSES.NEGOTIATING]: [
    SWAP_STATUSES.ACCEPTED,
    SWAP_STATUSES.REJECTED,
    SWAP_STATUSES.CANCELLED,
    SWAP_STATUSES.DISPUTED,
  ],
  [SWAP_STATUSES.ACCEPTED]: [
    SWAP_STATUSES.SHIPPING,
    SWAP_STATUSES.READY_FOR_EXCHANGE,
    SWAP_STATUSES.COMPLETED,
    SWAP_STATUSES.CANCELLED,
    SWAP_STATUSES.DISPUTED,
  ],
  [SWAP_STATUSES.SHIPPING]: [
    SWAP_STATUSES.COMPLETED,
    SWAP_STATUSES.DISPUTED,
  ],
  [SWAP_STATUSES.READY_FOR_EXCHANGE]: [
    SWAP_STATUSES.COMPLETED,
    SWAP_STATUSES.DISPUTED,
  ],
  [SWAP_STATUSES.COMPLETED]: [
    SWAP_STATUSES.DISPUTED, // In case an issue is found right after handover
  ],
  [SWAP_STATUSES.REJECTED]: [],
  [SWAP_STATUSES.CANCELLED]: [],
  [SWAP_STATUSES.DISPUTED]: [
    SWAP_STATUSES.COMPLETED, // If resolved positively
    SWAP_STATUSES.CANCELLED, // If dispute cancels the swap
  ],
  [SWAP_STATUSES.EXPIRED]: [],
};

/**
 * Validates whether a state transition is legal
 */
export const isValidTransition = (fromStatus, toStatus) => {
  const allowed = ALLOWED_TRANSITIONS[fromStatus];
  if (!allowed) return false;
  return allowed.includes(toStatus);
};

/**
 * Validates user action authorization for given transition
 */
export const canUserPerformTransition = ({ currentStatus, targetStatus, userId, senderId, receiverId, role }) => {
  if (role === 'ADMIN') return true; // Admins can resolve or moderate

  const isSender = userId === senderId;
  const isReceiver = userId === receiverId;
  const isParticipant = isSender || isReceiver;

  if (!isParticipant) return false;

  switch (targetStatus) {
    case SWAP_STATUSES.ACCEPTED:
      // In PENDING, only receiver can accept. In NEGOTIATING, either party can accept counter-offer.
      if (currentStatus === SWAP_STATUSES.PENDING) return isReceiver;
      if (currentStatus === SWAP_STATUSES.NEGOTIATING) return isParticipant;
      return false;

    case SWAP_STATUSES.REJECTED:
      // Only receiver can reject initial proposal, or either can reject ongoing negotiation
      return isReceiver || currentStatus === SWAP_STATUSES.NEGOTIATING;

    case SWAP_STATUSES.CANCELLED:
      // Sender can cancel at any time before completion, or either if agreed
      return isSender || isParticipant;

    case SWAP_STATUSES.NEGOTIATING:
      return isParticipant;

    case SWAP_STATUSES.SHIPPING:
    case SWAP_STATUSES.READY_FOR_EXCHANGE:
    case SWAP_STATUSES.COMPLETED:
    case SWAP_STATUSES.DISPUTED:
      return isParticipant;

    default:
      return false;
  }
};
