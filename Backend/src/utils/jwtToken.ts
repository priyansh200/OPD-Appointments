import { Response } from "express";

interface User {
  role: string;
  firstName: string;
  lastName: string;
  generateJsonWebToken: () => string;
}

export const generateToken = (
  user: User,
  message: string,
  statusCode: number,
  res: Response
) => {
  const token = user.generateJsonWebToken();
  const cookieName = user.role === "Admin" ? "adminToken" : "patientToken";

  const parsedStatusCode = parseInt(statusCode.toString(), 10);
  const parsedCookieExpire = parseInt(process.env.COOKIE_EXPIRE || "0", 10);

  return res
    .status(parsedStatusCode)
    .cookie(cookieName, token, {
      expires: new Date(Date.now() + parsedCookieExpire * 24 * 60 * 60 * 1000),
      httpOnly: true,
    })
    .json({
      success: true,
      message,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    });
};
