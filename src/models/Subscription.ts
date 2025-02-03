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

  isValid(): boolean {
    // TODO: validate that category is a known value
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
