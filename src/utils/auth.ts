import * as jwt from 'jsonwebtoken';

export interface AuthTokenPayload {
    id: number;
    email: string;
}

export function decodeAuthHeader(authHeader: String): AuthTokenPayload {
    const token = authHeader.replace("Bearer ", "");

    if (!token) {
        throw new Error("No token found");
    }
    
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret' as jwt.Secret) as AuthTokenPayload;
}
