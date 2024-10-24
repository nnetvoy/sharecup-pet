export interface IStatistic {
  amount: string
  approve: boolean,
  createdAt: string
  type: 'order' | 'return'
  _id: string;
}
