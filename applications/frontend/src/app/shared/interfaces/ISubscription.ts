export interface ISubscription {
  readonly _id: string;
  type: 'privateBase' | 'privateStudent'| 'companyBase' | 'companyPremium';
  period: 'month' | 'year';
  user: string;
  cupsAvailable: number;
  cupsCurrent: number;
}
