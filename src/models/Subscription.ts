import { CategoryMap } from '@/constants';
import { UUID } from './types';

// Subscription describes a single subscription, i.e. a recurring payment for a service
export class Subscription {
  constructor(
    public subscriptionId: UUID,
    public serviceName: string,
    public category: string, // TODO: extract this to a separate type
    public cost: number,
    public billingCycle: 'monthly' | 'annual',
    public nextRenewal: Date,
    public valueRating: number,
    public notes: string = '',
    public status: 'active' | 'inactive' = 'active'
  ) {}

  static buildFromFormData(formData: {
    subscriptionId: UUID;
    serviceName: string;
    category: string;
    cost: string | number;
    billingCycle: 'monthly' | 'annual';
    nextRenewal: string | Date;
    valueRating: string | number;
    notes?: string;
    active?: boolean;
  }): Subscription {
    return new Subscription(
      formData.subscriptionId,
      formData.serviceName,
      formData.category,
      Number(formData.cost),
      formData.billingCycle,
      formData.nextRenewal instanceof Date
        ? formData.nextRenewal
        : new Date(formData.nextRenewal),
      Number(formData.valueRating),
      formData.notes || '',
      formData.active ? 'active' : 'inactive'
    );
  }

  isActive(): boolean {
    return this.status === 'active';
  }

  isValid(): boolean {
    // validate that category is a known value
    const categories = Object.keys(CategoryMap);
    if (!categories.includes(this.category)) return false;

    // validate that the next renewal date is in the future if the status is active
    if (this.status === 'active' && this.nextRenewal <= new Date()) {
      console.error(
        'Next renewal date must be in the future for active subscriptions.'
      );
      return false;
    }

    return (
      typeof this.subscriptionId === 'string' &&
      this.cost > 0 &&
      this.valueRating >= 1 &&
      this.valueRating <= 5
    );
  }

  // TODO: method to return a set of validation errors?
}
