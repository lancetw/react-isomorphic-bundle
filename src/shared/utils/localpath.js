const HOST = 'localhost'
const PROTOCOL = 'http'
const PORT = '3000'
const LOCAL_PATH = process.env.BROWSER
  ? `${PROTOCOL}://${HOST}:${PORT}`
  : ''

export default LOCAL_PATH
