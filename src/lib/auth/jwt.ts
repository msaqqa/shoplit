import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET!;
const secret = new TextEncoder().encode(JWT_SECRET);

// SIGN TOKEN
export async function signToken(
  payload: Record<string, unknown>,
  expiration: string = "7d"
) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiration)
    .sign(secret);
}

// VERIFY TOKEN (Edge compatible)
export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload;
}
