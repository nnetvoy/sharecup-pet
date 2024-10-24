export class CreateSubscriptionDto {
  readonly type: 'privateBase' | 'privateStudent'| 'companyBase' | 'companyPremium';
  readonly period: 'month' | 'year';
}
