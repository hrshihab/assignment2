import { Model } from 'mongoose'

export type TFullName = {
  firstName: string
  lastName: string
}

export type TAddress = {
  street: string
  city: string
  country: string
}

export type TOrder = {
  productName: string
  price: number
  quantity: number
}

export type TUserOrder = {
  userId: number
  username: string
  password: string
  fullName: TFullName
  age: number
  email: string
  isActive: boolean
  hobbies: [string, string]
  address: TAddress
  orders?: TOrder[]
}

export interface UserOrderModel extends Model<TUserOrder> {
  isUserExists(id: string): Promise<TUserOrder | null>
}
