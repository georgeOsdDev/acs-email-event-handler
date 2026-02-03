export interface GetSuppressionResponse {
  email: string;
  isSuppressed: boolean;
}

export async function handleGetSuppression(
  email: string,
  service: { isSuppressed(email: string): Promise<boolean> }
): Promise<GetSuppressionResponse> {
  const isSuppressed = await service.isSuppressed(email);
  return { email, isSuppressed };
}
