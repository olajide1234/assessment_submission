import dotenv from 'dotenv';
dotenv.config();

export const baseApiUrl = 'https://api.fillout.com/v1/api';
export const apiKey = process.env.FILLOUT_API_KEY
