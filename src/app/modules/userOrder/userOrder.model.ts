/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, model } from 'mongoose'
import {
  TAddress,
  TFullName,
  TOrder,
  TUserOrder,
  UserOrderModel,
} from './userOrder.interface'
import bcrypt from 'bcrypt'
import config from '../../config'

const fullNameSchema = new Schema<TFullName>(
  {
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
  },
  { _id: false },
)

const addressSchema = new Schema<TAddress>(
  {
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
  },
  { _id: false },
)

const orderSchema = new Schema<TOrder>(
  {
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
  },
  { _id: false },
)

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
    type: [String],
    required: [true, 'Hobbies must be required'],
  },
  address: {
    type: addressSchema,
    required: [true, 'Address must be required'],
  },
  orders: [orderSchema],
})
// Use pre('save') for save operations
userOrderSchema.pre('save', async function (next) {
  const user = this as TUserOrder

  // Always hash the password when saving or updating the document
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  )

  next()
})

// Use pre('findOneAndUpdate') for update operations
userOrderSchema.pre('findOneAndUpdate', async function (next) {
  const update = this as any // Using 'any' here because pre middleware typings don't include 'update' directly

  // Check if the password field is present in the update
  if (update._update && update._update.password) {
    update._update.password = await bcrypt.hash(
      update._update.password,
      Number(config.bcrypt_salt_rounds),
    )
  }

  next()
})

// Declare the static method
userOrderSchema.statics.isUserExists = async function (
  userId: number,
): Promise<TUserOrder | null> {
  return this.findOne({ userId }).exec()
}

export const UserOrder = model<TUserOrder, UserOrderModel>(
  'UserOrder',
  userOrderSchema,
)
