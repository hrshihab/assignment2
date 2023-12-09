/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import userOrderSchemaZod from './userOrder.validation'
import { UserOrderServices } from './userOrder.service'

// Create a new user
const createUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body
    const zodParseData = userOrderSchemaZod.parse(userData)
    const result = await UserOrderServices.createUserIntoDB(zodParseData)

    // Exclude sensitive fields (password) and filter out empty orders
    const sanitizedResult = {
      ...result.toObject(),
      password: undefined,
      orders: undefined,
      _id: undefined,
      __v: undefined,
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

// Get all users with selected fields
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await UserOrderServices.getAllUserDB({
      username: 1,
      fullName: 1,
      age: 1,
      email: 1,
      address: 1,
      _id: 0,
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

// Get a single user by userId
const getSingleUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const result = await UserOrderServices.getSingleUserDB(parseInt(userId))

    // Check if the user is not found
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

// Update a user by userId
const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const updateData = req.body
    const result = await UserOrderServices.updateUserDB(
      parseInt(userId, 10),
      updateData,
    )
    res.status(200).json({
      success: true,
      message: 'User updated successfully!',
      data: result,
    })
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || 'User not found!',
      error: {
        code: 404,
        description: 'User not found!',
      },
    })
  }
}

// Delete a user by userId
const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const result = await UserOrderServices.deleteUserDB(parseInt(userId))

    // Check if the user is not found
    if ((await result.deletedCount) < 1) {
      return res.status(404).json({
        success: false,
        message: 'User not found!',
        error: {
          code: 404,
          description: 'User not found!',
        },
      })
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully!',
      data: null,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong!',
      error: {
        code: 500,
        description: 'Internal server error!',
      },
    })
  }
}

// Add a product to the orders array for a specific user
const addProductToOrder = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const orderData = req.body
    await UserOrderServices.addProductToOrderDB(parseInt(userId), orderData)
    res.status(201).json({
      success: true,
      message: 'Order created successfully!',
      data: null,
    })
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || 'User not found!',
      error: {
        code: 404,
        description: 'User not found!',
      },
    })
  }
}

// Get all orders for a specific user
const getAllOrders = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const result = await UserOrderServices.getAllOrdersDB(parseInt(userId))
    res.status(201).json({
      success: true,
      message: 'Order fetched successfully!',
      data: result,
    })
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || 'User not found!',
      error: {
        code: 404,
        description: 'User not found!',
      },
    })
  }
}

// Calculate total price for all orders of a specific user
const calculateTotalPrice = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params

    // Call the service method to calculate the total price
    const totalPrice = await UserOrderServices.calculateTotalPriceDB(
      parseInt(userId),
    )

    res.status(200).json({
      success: true,
      message: 'Total price calculated successfully!',
      data: {
        totalPrice,
      },
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || 'User not found!',
      error: {
        code: 404,
        description: 'User not found!',
      },
    })
  }
}

export const userControllers = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  addProductToOrder,
  getAllOrders,
  calculateTotalPrice,
}
