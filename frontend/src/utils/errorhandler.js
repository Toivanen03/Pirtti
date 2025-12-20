export function errorHandler(errOrResponse, fallback = 'Tuntematon virhe') {

    if (errOrResponse?.errors && Array.isArray(errOrResponse.errors)) {
        return errOrResponse.errors.map(e => e.message).join(' ')
    }

    if (errOrResponse?.graphQLErrors) {
        return errOrResponse.graphQLErrors.map(e => e.message).join(' ')
    }

    if (errOrResponse?.networkError) {
        return errOrResponse.networkError.result?.errors
            ?.map(e => e.message).join(' ')
            || errOrResponse.networkError.message
    }

    if (errOrResponse instanceof Error) {
        return errOrResponse.message || fallback
    }

    if (typeof errOrResponse === 'string') {
        return errOrResponse
    }

    if (errOrResponse?.message) {
        return errOrResponse.message
    }

    return fallback
}