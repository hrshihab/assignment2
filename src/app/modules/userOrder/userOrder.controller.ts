import { Request, Response } from 'express'
import userOrderSchemaZod from './userOrder.validation'
import { UserOrderServices } from './userOrder.service'

const createUser = async (req: Request, res: Response) => {
  try {
    const { user: userData } = req.body
    const zodParseData = userOrderSchemaZod.parse(userData)
    const result = await UserOrderServices.createUserIntoDB(zodParseData)
    // Exclude password field and filter out empty orders
    const sanitizedResult = {
      ...result.toObject(),
      password: undefined,
      orders: undefined,
    }
    res.status(200).json({
      success: true,
      message: 'User created Successfully',
      data: sanitizedResult,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'something went wrong',
      error: error,
    })
  }
}

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await UserOrderServices.getAllUserDB({
      username: 1,
      fullName: 1,
      age: 1,
      email: 1,
      address: 1,
    })
    res.status(200).json({
      success: true,
      message: 'Users fetched successfully!',
      data: result,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error,
    })
  }
}
const getSingleUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const result = await UserOrderServices.getSingleUserDB(parseInt(userId, 10))
    if (result === null || result === undefined || result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: {
          code: 404,
          description: 'User not found!',
        },
      })
    }
    res.status(200).json({
      success: true,
      message: 'User fetched successfully!',
      data: result,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message || 'Something went wrong',
    })
  }
}

export const userControllers = {
  createUser,
  getAllUsers,
  getSingleUser,
}
