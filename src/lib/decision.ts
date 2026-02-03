export type DeliveryStatus =
  | 'Delivered'
  | 'Failed'
  | 'Bounced'
  | 'Queued'
  | 'Suppressed'
  | 'Complaint'
  | 'Unknown';

export type SuppressionAction = 'add' | 'remove' | 'none';

export interface DeliveryDecisionInput {
  status: DeliveryStatus | string;
  recipient: string;
  failureType?: 'Permanent' | 'Transient' | 'Unknown';
}

export interface DeliveryDecisionResult {
  action: SuppressionAction;
  reason: string;
}

export function decideSuppressionAction(
  input: DeliveryDecisionInput
): DeliveryDecisionResult {
  const status = normalizeStatus(input.status);

  if (status === 'Bounced') {
    return { action: 'add', reason: 'bounced' };
  }

  if (status === 'Complaint') {
    return { action: 'add', reason: 'complaint' };
  }

  if (status === 'Failed') {
    if (input.failureType === 'Permanent') {
      return { action: 'add', reason: 'failed_permanent' };
    }
    return { action: 'none', reason: 'failed_transient' };
  }

  return { action: 'none', reason: 'no_change' };
}

function normalizeStatus(status: string): DeliveryStatus {
  switch (status) {
    case 'Delivered':
    case 'Failed':
    case 'Bounced':
    case 'Queued':
    case 'Suppressed':
    case 'Complaint':
      return status;
    default:
      return 'Unknown';
  }
}
