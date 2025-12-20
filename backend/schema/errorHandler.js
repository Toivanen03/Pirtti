import { GraphQLError } from 'graphql'
import { z } from 'zod'
import MailSender from '../utils/mailer'
import ErrorLog from '../models/ErrorLog'

export const handleErrors = (resolver) => async (...args) => {
    async function report(error) {
        try {
            await ErrorLog.create({
                message: error.message || 'Tuntematon virhe',
                stack: error.stack,
                resolver: resolver.name || 'unknown',
                variables: args[1]
            })
        } catch (dbErr) {
            console.error('Virheen tallennus tietokantaan epäonnistui:', dbErr)
        }

        await MailSender(null, 'tech@simotoivanen.fi', error)
    }
    try {
        return await resolver(...args)
    } catch (err) {
        console.error('Resolver error:', err)

        if (err instanceof z.ZodError) {
            const messages = err.issues.map(issue => issue.message)
            throw new GraphQLError(messages.join('\n'))
        }

        if (err.code === 11000) {
            throw new GraphQLError('Tunnus on jo olemassa.')
        }

        if (err instanceof GraphQLError) {
            await report(err)
            throw err
        }

        await report(err)
        throw new GraphQLError(err.message || 'Tuntematon virhe')
    }
}