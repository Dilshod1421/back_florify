import { Response } from 'express';

export async function generateToken(jwt_payload: object, jwtService: any) {
  const [access_token, refresh_token] = await Promise.all([
    jwtService.signAsync(jwt_payload, {
      secret: process.env.ACCESS_TOKEN_KEY,
      expiresIn: process.env.ACCESS_TOKEN_TIME,
    }),
    jwtService.signAsync(jwt_payload, {
      secret: process.env.REFRESH_TOKEN_KEY,
      expiresIn: process.env.REFRESH_TOKEN_TIME,
    }),
  ]);
  return { access_token, refresh_token };
}

export async function writeToCookie(refresh_token: string, res: Response) {
  res.cookie('refresh_token', refresh_token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
}
