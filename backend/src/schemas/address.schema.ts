import { z } from 'zod';

export const createAddressSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    addressLine1: z.string().min(5, 'Address Line 1 must be at least 5 characters'),
    addressLine2: z.string().optional(),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    postalCode: z.string().min(5, 'Postal code is required'),
    country: z.string().default('India'),
    isDefault: z.boolean().default(false),
  }),
});

export const updateAddressSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid address ID'),
  }),
  body: z.object({
    fullName: z.string().min(2).optional(),
    phone: z.string().min(10).optional(),
    addressLine1: z.string().min(5).optional(),
    addressLine2: z.string().optional(),
    city: z.string().min(2).optional(),
    state: z.string().min(2).optional(),
    postalCode: z.string().min(5).optional(),
    country: z.string().optional(),
    isDefault: z.boolean().optional(),
  }),
});
