import { z } from 'zod'

const fullNameSchema = z.object({
  firstName: z
    .string()
    .min(1)
    .max(255)
    .refine((val) => val.trim() !== '', {
      message: 'First name must not be empty or contain only whitespace',
    }),
  lastName: z
    .string()
    .min(1)
    .max(255)
    .refine((val) => val.trim() !== '', {
      message: 'Last name must not be empty or contain only whitespace',
    }),
})

const addressSchema = z.object({
  street: z.string().min(1).max(255),
  city: z.string().min(1).max(255),
  country: z.string().min(1).max(255),
})

const orderSchema = z.object({
  productName: z.string().min(1).max(255),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
})

export const userOrderSchemaZod = z.object({
  userId: z.number(),
  username: z.string(),
  password: z.string(),
  fullName: fullNameSchema,
  age: z.number().positive(),
  email: z.string().email(),
  isActive: z.boolean(),
  hobbies: z.array(z.string().min(1).max(255)),
  address: addressSchema,
  orders: z.array(orderSchema).optional(),
})

// Validate function
// export const validateUserOrder = (data: unknown) =>
//   userOrderSchemaZod.parse(data)

export default userOrderSchemaZod
