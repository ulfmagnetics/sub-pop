import { CategoryMap } from '@/constants';

// Subscription describes a single subscription, i.e. a recurring payment for a service
export class Subscription {
  constructor(
    public id: number,
    public serviceName: string,
    public category: string, // TODO: extract this to a separate type
    public cost: number,
    public billingCycle: 'monthly' | 'annual',
    public nextRenewal: Date,
    public valueRating: number,
    public notes: string = ''
    // TODO: add a status field (active, canceled,  expired)
  ) {}

  static buildFromFormData(formData: {
    id: number;
    serviceName: string;
    category: string;
    cost: string | number;
    billingCycle: 'monthly' | 'annual';
    nextRenewal: string | Date;
    valueRating: string | number;
    notes?: string;
  }): Subscription {
    return new Subscription(
      formData.id,
      formData.serviceName,
      formData.category,
      Number(formData.cost),
      formData.billingCycle,
      formData.nextRenewal instanceof Date
        ? formData.nextRenewal
        : new Date(formData.nextRenewal),
      Number(formData.valueRating),
      formData.notes || ''
    );
  }

  isValid(): boolean {
    // validate that category is a known value
    const categories = Object.keys(CategoryMap);
    if (!categories.includes(this.category)) return false;

    // TODO: validate that the next renewal date is in the future if the status is active

    return (
      Number.isInteger(this.id) &&
      this.cost > 0 &&
      this.valueRating >= 1 &&
      this.valueRating <= 5
    );
  }

  // TODO: method to return a set of validation errors?
}
