import { z } from 'zod'

export const createContactsSchema = z.object({
  puhelin_1: z.string()
    .optional()
    .refine(val => !val || /^[+0]/.test(val), 'Puhelinnumeron tulee alkaa + -merkillä tai numerolla 0')
    .refine(val => !val || val.length >= 10, 'Puhelinnumerossa on oltava vähintään 10 merkkiä'),

  puhelin_2: z.string()
    .optional()
    .refine(val => !val || /^[+0]/.test(val), 'Puhelinnumeron tulee alkaa + -merkillä tai numerolla 0')
    .refine(val => !val || val.length >= 10, 'Puhelinnumerossa on oltava vähintään 10 merkkiä'),

  puhelin_3: z.string()
    .optional()
    .refine(val => !val || /^[+0]/.test(val), 'Puhelinnumeron tulee alkaa + -merkillä tai numerolla 0')
    .refine(val => !val || val.length >= 10, 'Puhelinnumerossa on oltava vähintään 10 merkkiä'),

  sahkoposti: z.email('Sähköpostiosoite ei ole kelvollista muotoa').optional(),
})