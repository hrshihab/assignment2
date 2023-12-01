import { TUserOrder } from './userOrder.interface'
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

export const UserOrderServices = {
  createUserIntoDB,
  getAllUserDB,
  getSingleUserDB,
}
