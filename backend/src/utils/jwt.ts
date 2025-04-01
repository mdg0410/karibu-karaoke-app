import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'karibu_karaoke_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export interface JwtPayload {
  id: string;
  role?: string;
  [key: string]: any;
}

export const generateToken = (payload: JwtPayload): string => {
  // Aquí usamos casting para que TypeScript trate JWT_EXPIRES_IN como un tipo compatible
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']
  };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export default { generateToken, verifyToken };
