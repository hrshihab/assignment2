import express from 'express'
import { userControllers } from './userOrder.controller'

const router = express.Router()

router.post('/', userControllers.createUser)
router.get('/', userControllers.getAllUsers)
router.get('/:userId', userControllers.getSingleUser)

export const userRoutes = router
