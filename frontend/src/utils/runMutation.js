import { errorHandler } from "./errorhandler"

export async function runMutation(mutationFn, options = {}) {
    try {
        const res = await mutationFn({ ...options })

        const errMsg = errorHandler(res)
        if (errMsg && res.errors) {
            return { ok: false, error: errMsg }
        }

        return { ok: true, data: res.data }
    } catch (err) {
        return { ok: false, error: errorHandler(err) }
    }
}