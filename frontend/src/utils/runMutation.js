import { errorHandler } from "./errorhandler"

export async function runMutation(mutationFn, options = {}) {
    try {
        const res = await mutationFn({ ...options })
        
        let errorMessage = null
        
        if (res.error) {
            if (res.error.graphQLErrors?.length) {
                errorMessage = res.error.graphQLErrors.map(e => e.message).join('\n')
            } else if (res.error.message) {
                errorMessage = res.error.message
            }
        }

        if (errorMessage) {
            return { ok: false, error: errorMessage }
        }

        if (!res.data) {
            return { ok: false, error: 'Tuntematon virhe selaimessa' }
        }

        return { ok: true, data: res.data }

    } catch (err) {
        return { ok: false, error: errorHandler(err) }
    }
}