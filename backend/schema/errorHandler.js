import { GraphQLError } from 'graphql'
import { z } from 'zod'

export const handleErrors = (resolver) => async (...args) => {
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
            throw err
        }

        throw new GraphQLError(err.message || 'Tuntematon virhe')
    }
}