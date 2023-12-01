import { TOrder, TUserOrder } from './userOrder.interface'
import { UserOrder } from './userOrder.model'

// Create a new user in the database
const createUserIntoDB = async (userData: TUserOrder) => {
  if (await UserOrder.isUserExists(userData.userId)) {
    throw new Error('User already exists!')
  }

  const result = await UserOrder.create(userData)
  return result
}

// Retrieve all users from the database with optional projection
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAllUserDB = async (projection: Record<string, any>) => {
  const result = await UserOrder.find({}, projection).lean().exec()
  return result
}

// Retrieve a single user from the database based on userId
const getSingleUserDB = async (userId: number) => {
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

// Update a user in the database based on userId
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

// Delete a user from the database based on userId
const deleteUserDB = async (userId: number) => {
  const result = await UserOrder.deleteOne({ userId: userId })
  return result
}

// Add a product to the orders array for a specific user
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error adding product to order:', error)
    throw error // Re-throw the original error
  }
}

// Retrieve all orders for a specific user
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

// Calculate the total price of all orders for a specific user
const calculateTotalPriceDB = async (userId: number) => {
  const result = await UserOrder.findOne({ userId })

  if (!result) {
    throw new Error('User not found!')
  }

  // Calculate total price by summing the prices of all orders
  // Check if orders array exists before attempting to reduce
  const totalPrice = result.orders
    ? result.orders.reduce(
        (acc, order) => acc + order.price * order.quantity,
        0,
      )
    : 0
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
