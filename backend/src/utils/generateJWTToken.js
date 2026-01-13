import jwt from 'jsonwebtoken';

export const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

export const attachTokenCookies = (res, accessToken, refreshToken) => {
  
  const cookieConfig = {
    httpOnly: true,
    secure: true, 
    sameSite: "none", 
    path: "/",
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
