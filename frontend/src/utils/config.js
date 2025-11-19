const Config = () => {
  const url = import.meta.env.VITE_BACKEND_URL
  const port = import.meta.env.VITE_BACKEND_PORT

  return port ? `${url}:${port}` : url
}

export default Config