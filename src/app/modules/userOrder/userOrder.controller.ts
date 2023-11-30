import { Request, Response } from 'express'
import userOrderSchemaZod from './userOrder.validation'

const createUser = async (req: Request, res: Response) => {
  try {
    const { user } = req.body
    const zodParseData = userOrderSchemaZod.parse(user)
    res.status(200).json({
      success: true,
      message: 'User created Successfully',
      data: zodParseData,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'something went wrong',
      error: error,
    })
  }
}

export const userControllers = {
  createUser,
}
