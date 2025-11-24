// JWT utility functions

export interface JWTPayload {
    sub: string; // email
    roles: string[]; // e.g., ["ROLE_PACIENTE", "ROLE_MEDICO"]
    iat: number;
    exp: number;
}

/**
 * Decode JWT token without verification
 * Note: This only decodes the payload, it doesn't verify the signature
 */
export const decodeJWT = (token: string): JWTPayload | null => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            console.error('Invalid JWT format');
            return null;
        }

        const payload = parts[1];
        const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decoded);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
};

/**
 * Extract role from JWT roles array
 * Converts "ROLE_PACIENTE" to "PACIENTE"
 */
export const extractRole = (roles: string[]): 'PACIENTE' | 'MEDICO' | 'ADMIN' => {
    const role = roles[0]?.replace('ROLE_', '') as 'PACIENTE' | 'MEDICO' | 'ADMIN';
    return role || 'PACIENTE';
};

/**
 * Check if JWT token is expired
 */
export const isTokenExpired = (token: string): boolean => {
    const payload = decodeJWT(token);
    if (!payload) return true;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
};
