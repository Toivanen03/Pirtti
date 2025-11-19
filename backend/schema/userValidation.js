import { z } from 'zod'

export const createUserSchema = z.object({
  email: z
    .email('Käyttäjätunnuksen on oltava kelvollinen sähköpostiosoite'),
  password: z.string()
    .min(8, 'Salasanan on oltava vähintään 8 merkkiä pitkä')
    .refine(val => /[a-zA-Z]/.test(val), 'Salasanassa tulee olla kirjaimia')
    .refine(val => /\d/.test(val), 'Salasanassa tulee olla numeroita')
    .refine(val => /[!@#$%^&*(),.?":{}|<>]/.test(val), 'Salasanassa on oltava vähintään yksi erikoismerkki'),
  admin: z.boolean(),
  notifications: z.boolean().optional()
})