export interface UpdateSuppressionRequest {
  email: string;
  action: 'add' | 'remove';
  reason?: string;
}

export interface UpdateSuppressionResponse {
  email: string;
  status: 'updated';
}

export async function handleUpdateSuppression(
  request: UpdateSuppressionRequest,
  service: { apply(input: { action: 'add' | 'remove'; email: string; reason?: string }): Promise<void> }
): Promise<UpdateSuppressionResponse> {
  await service.apply({
    action: request.action,
    email: request.email,
    reason: request.reason
  });

  return { email: request.email, status: 'updated' };
}
