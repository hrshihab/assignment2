import { Schema, model } from 'mongoose'
import {
  TAddress,
  TFullName,
  TOrder,
  TUserOrder,
  UserOrderModel,
} from './userOrder.interface'

const fullNameSchema = new Schema<TFullName>({
  firstName: {
    type: String,
    trim: true,
    required: [true, 'First name must be required'],
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, 'Last name also required'],
  },
})

const addressSchema = new Schema<TAddress>({
  street: {
    type: String,
    required: [true, 'Street must be required'],
  },
  city: {
    type: String,
    required: [true, 'City must be required'],
  },
  country: {
    type: String,
    required: [true, 'Country must be required'],
  },
})

const orderSchema = new Schema<TOrder>({
  productName: {
    type: String,
    required: [true, 'Product Name required'],
  },
  price: {
    type: Number,
    required: [true, 'Price must be mentioned'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity must required'],
  },
})

const userOrderSchema = new Schema<TUserOrder, UserOrderModel>({
  userId: {
    type: Number,
    required: [true, 'UserID must be required and unique'],
    unique: true,
  },
  username: {
    type: String,
    required: [true, 'UserName must be required and unique'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password must be required'],
  },
  fullName: {
    type: fullNameSchema,
    required: [true, 'Name must be required'],
  },
  age: {
    type: Number,
    required: [true, 'AGe must be required'],
  },
  email: {
    type: String,
    required: [true, 'email must be required'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  hobbies: {
    type: [String, String],
    required: [true, 'Hobbies must be required'],
  },
  address: {
    type: addressSchema,
    required: [true, 'Address must be required'],
  },
  orders: [orderSchema],
})

export const UserOrder = model<TUserOrder, UserOrderModel>(
  'UserOrder',
  userOrderSchema,
)
