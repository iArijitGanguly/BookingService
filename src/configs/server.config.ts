import dotenv from 'dotenv';

type ServerConfig = {
    PORT: number
}

dotenv.config();

export const serverConfig: ServerConfig =  {
    PORT: Number(process.env.PORT) || 3000
};