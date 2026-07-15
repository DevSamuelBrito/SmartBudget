type CookieBaseOptions = {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "none" | "lax";
  path: string;
};

export function getCookieBase(
  overrides?: Partial<CookieBaseOptions>,
): CookieBaseOptions {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    ...overrides,
  };
}
