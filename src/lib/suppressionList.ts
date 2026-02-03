export interface SuppressionListClient {
  add(email: string, reason: string): Promise<void>;
  remove(email: string): Promise<void>;
  isSuppressed(email: string): Promise<boolean>;
  setLogger?(logger: { log(...args: any[]): void }): void;
}

export interface SuppressionApplyInput {
  action: 'add' | 'remove' | 'none';
  email: string;
  reason?: string;
}

export class SuppressionListService {
  constructor(private readonly client: SuppressionListClient) {}

  async apply(input: SuppressionApplyInput): Promise<void> {
    if (input.action === 'none') {
      return;
    }

    if (input.action === 'add') {
      await this.client.add(input.email, input.reason ?? 'unknown');
      return;
    }

    await this.client.remove(input.email);
  }

  async isSuppressed(email: string): Promise<boolean> {
    return this.client.isSuppressed(email);
  }
}
