import { errorHandler } from "./errorhandler"

export async function runMutation(mutationFn, options = {}) {
    try {
        const res = await mutationFn({ ...options })

        if (res.errors && res.errors.length > 0) {
            return {
                ok: false,
                error: res.errors.map(e => e.message).join('\n')
            }
        }

        if (!res.data) {
            return { ok: false, error: 'Tuntematon virhe' }
        }

        return { ok: true, data: res.data }
    } catch (err) {
        return { ok: false, error: errorHandler(err) }
    }
}