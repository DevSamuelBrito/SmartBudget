import { getCookieBase } from "@/lib/cookie-config";

describe("getCookieBase", () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    (process.env as { NODE_ENV: string }).NODE_ENV = originalEnv;
  });

  it("uses SameSite=None and Secure in production, for cross-site cookies", () => {
    (process.env as { NODE_ENV: string }).NODE_ENV = "production";

    expect(getCookieBase()).toEqual({
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });
  });

  it("uses SameSite=Lax and non-Secure outside production", () => {
    (process.env as { NODE_ENV: string }).NODE_ENV = "development";

    expect(getCookieBase()).toEqual({
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });
  });

  it("allows overriding individual fields while keeping SameSite consistent", () => {
    (process.env as { NODE_ENV: string }).NODE_ENV = "production";

    expect(getCookieBase({ httpOnly: false })).toEqual({
      httpOnly: false,
      secure: true,
      sameSite: "none",
      path: "/",
    });
  });
});
