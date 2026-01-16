import jwt from "jsonwebtoken";

export const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

export const attachTokenCookies = (res, accessToken, refreshToken) => {
  const isProduction = process.env.NODE_ENV === "production";

  const cookieConfig = {
    httpOnly: true,
    secure: isProduction, // HTTPS only
    sameSite: "none",     // cross-site cookies
    path: "/",
    ...(isProduction && process.env.COOKIE_DOMAIN && {
      domain: process.env.COOKIE_DOMAIN, // frontend domain
    }),
  };

  res.cookie("accessToken", accessToken, {
    ...cookieConfig,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieConfig,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
