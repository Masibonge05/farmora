import { useContext } from 'react'
import AuthContext from '../contexts/AuthContext'
import { apiRequest } from './api'

export default function useApi() {
  const { token } = useContext(AuthContext)

  const request = async (path, opts = {}) => {
    return apiRequest(path, { token, ...opts })
  }

  return { request }
}
