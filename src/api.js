import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
})

api.interceptors.request.use((config) => {
  console.group(`🚀 ${config.method?.toUpperCase()} ${config.url}`)

  console.log('Full URL:', `${config.baseURL}${config.url}`)
  console.log('Method:', config.method?.toUpperCase())
  console.log('Params:', config.params)
  console.log('Data:', config.data)

  console.groupEnd()

  return config
})

api.interceptors.response.use(
  (response) => {
    console.group(`✅ ${response.status} ${response.config.url}`)

    console.log('Status:', response.status)
    console.log('Full URL:', response.config.url)
    console.log('Response:', response.data)

    console.groupEnd()

    return response
  },
  (error) => {
    console.group('❌ API ERROR')

    console.log('Status:', error.response?.status)
    console.log('URL:', error.config?.url)
    console.log('Base URL:', error.config?.baseURL)
    console.log(
      'Full URL:',
      `${error.config?.baseURL}${error.config?.url}`
    )
    console.log('Method:', error.config?.method?.toUpperCase())
    console.log('Response:', error.response?.data)
    console.log('Message:', error.message)

    console.groupEnd()

    return Promise.reject(error)
  }
)

export default api
