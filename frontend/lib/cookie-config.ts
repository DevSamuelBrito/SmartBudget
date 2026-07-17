type CookieBaseOptions = {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "none" | "lax";
  domain: string | undefined;
  path: string;
};

export function getCookieBase(
  overrides?: Partial<CookieBaseOptions>,
): CookieBaseOptions {
  const isProduction = process.env.NODE_ENV === "production";
  const cookieDomain = process.env.COOKIE_DOMAIN || undefined;

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    domain: cookieDomain,
    path: "/",
    ...overrides,
  };
}
