const Config = () => {
    return import.meta.env.VITE_BACKEND_URL + ':' + import.meta.env.VITE_BACKEND_PORT
}

export default Config