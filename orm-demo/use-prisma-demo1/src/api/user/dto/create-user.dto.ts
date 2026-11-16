import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const createUserSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long' })
    .max(20, { message: 'Username must be at most 20 characters long' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .max(50, { message: 'Password must be at most 50 characters long' }),
  profile: z
    .object({
      gender: z.number(),
      photo: z.string().optional(),
      address: z.string().optional(),
    })
    .optional(),
});

export class CreateUserDto extends createZodDto(createUserSchema) {}
