import { Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from './AuthContext'

const RequireAdmin = ({ children }) => {
  const { isLoggedIn, isLoading } = useContext(AuthContext)

  if (isLoading) return <p>Ladataan käyttäjätietoja...</p>
  if (!isLoggedIn) return <Navigate to="/login" replace />

  return children
}

export default RequireAdmin