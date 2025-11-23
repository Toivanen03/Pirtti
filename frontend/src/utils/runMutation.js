import { errorHandler } from "./errorhandler"

export async function runMutation(mutationFn, variables) {
    try {
        const res = await mutationFn({ variables })

        const errMsg = errorHandler(res)
        if (errMsg && res.errors) {
            return { ok: false, error: errMsg }
        }

        return { ok: true, data: res.data }
    } catch (err) {
        return { ok: false, error: errorHandler(err) }
    }
}