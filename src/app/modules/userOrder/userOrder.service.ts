import { TOrder, TUserOrder } from './userOrder.interface'
import { UserOrder } from './userOrder.model'

const createUserIntoDB = async (userData: TUserOrder) => {
  if (await UserOrder.isUserExists(userData.userId)) {
    throw new Error('User already exists!')
  }

  const result = await UserOrder.create(userData)
  return result
}

const getAllUserDB = async (projection: Record<string, any>) => {
  const result = await UserOrder.find({}, projection).lean().exec()
  return result
}

const getSingleUserDB = async (userId: number) => {
  //const result = await UserOrder.findOne({ userId })
  const result = await UserOrder.aggregate([
    { $match: { userId: Number(userId) } },
    {
      $project: {
        userId: 1,
        username: 1,
        fullName: 1,
        age: 1,
        email: 1,
        isActive: 1,
        hobbies: 1,
        address: 1,
      },
    },
  ])
  return result
}

const updateUserDB = async (
  userId: number,
  updateData: TUserOrder,
): Promise<TUserOrder | null> => {
  const result = await UserOrder.findOneAndUpdate({ userId }, updateData, {
    new: true,
    projection: {
      password: 0,
    },
  })
  if (!result) {
    throw new Error('User not found!')
  }
  return result
}

const deleteUserDB = async (userId: number) => {
  const result = await UserOrder.deleteOne({ userId: userId })
  return result
}

const addProductToOrderDB = async (
  userId: number,
  orderData: TOrder,
): Promise<TUserOrder | null> => {
  try {
    const user = await UserOrder.findOneAndUpdate(
      { userId },
      {
        $push: {
          orders: orderData,
        },
      },
      { new: true }, // Return the updated document
    )
    if (!user) {
      throw new Error('User not found!')
    }

    return user.toObject()
  } catch (error: any) {
    console.error('Error adding product to order:', error)
    throw error // Re-throw the original error
  }
}

const getAllOrdersDB = async (userId: number) => {
  const result = await UserOrder.aggregate([
    {
      $match: { userId: userId },
    },
    {
      $project: {
        orders: 1,
        _id: 0,
      },
    },
  ])

  return result
}

const calculateTotalPriceDB = async (userId: number) => {
  const result = await UserOrder.findOne({ userId })

  if (!result) {
    throw new Error('User not found!')
  }

  // Calculate total price by summing the prices of all orders
  const totalPrice = result.orders.reduce(
    (acc, order) => acc + order.price * order.quantity,
    0,
  )
  return totalPrice
}

export const UserOrderServices = {
  createUserIntoDB,
  getAllUserDB,
  getSingleUserDB,
  updateUserDB,
  deleteUserDB,
  addProductToOrderDB,
  getAllOrdersDB,
  calculateTotalPriceDB,
}
