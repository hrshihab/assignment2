import express from 'express'
import { userControllers } from './userOrder.controller'

const router = express.Router()

router.post('/', userControllers.createUser)

export const userRoutes = router
