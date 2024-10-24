export interface IRegisterUser {
  email: string
  password: string
  firstName: string
  lastName:string
  company: boolean
  companyInn: string | null
  companyOgrn: string | null
  companyKpp: string | null
  companyAddress: string | null
  companyName: string | null
}
