import { config as initDotenv } from 'dotenv'

import path from 'path'

initDotenv({ path: path.join(__dirname, '../../../.env') })

export const DISCORD_API_URL = process.env.DISCORD_API_URL
export const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID
export const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET
export const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI

export const THE_MOVIE_DB_API_KEY = process.env.THE_MOVIE_DB_API_KEY

export const POLL_URL = process.env.POLL_URL || 'http://192.168.1.7:8080/'
export const SPECIAL_USER_NAME = process.env.SPECIAL_USER_NAME
