import axios from 'axios'

export async function register(username: string, email: string, password: string) {
  const url = 'http://' + import.meta.env.VITE_BACKEND + '/auth/register'
  const response = await axios.post(url, {
    username,
    email,
    password
  })
  return response.data
}

export async function mail_login(email: string, password: string) {
  const url = 'http://' + import.meta.env.VITE_BACKEND + '/auth/mail_login'
  const response = await axios.post(url, {
    email,
    password
  })
  return response
}

export async function me() {
  const url = 'http://' + import.meta.env.VITE_BACKEND + '/auth/me'
  const response = await axios.get(url, { withCredentials: true })
  return response.data
}
