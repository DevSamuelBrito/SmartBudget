import { getCookieBase } from "@/lib/cookie-config";

describe("getCookieBase", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalCookieDomain = process.env.COOKIE_DOMAIN;

  afterEach(() => {
    (process.env as { NODE_ENV: string }).NODE_ENV = originalNodeEnv;
    process.env.COOKIE_DOMAIN = originalCookieDomain;
  });

  it("uses SameSite=None and Secure in production, for cross-site cookies", () => {
    (process.env as { NODE_ENV: string }).NODE_ENV = "production";
    process.env.COOKIE_DOMAIN = ".smartbudget-app.com";

    expect(getCookieBase()).toEqual({
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: ".smartbudget-app.com",
      path: "/",
    });
  });

  it("uses SameSite=Lax and non-Secure outside production", () => {
    (process.env as { NODE_ENV: string }).NODE_ENV = "development";
    delete process.env.COOKIE_DOMAIN;

    expect(getCookieBase()).toEqual({
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      domain: undefined,
      path: "/",
    });
  });

  it("falls back to host-only cookies when COOKIE_DOMAIN is unset, even in a production build (e.g. local Docker)", () => {
    (process.env as { NODE_ENV: string }).NODE_ENV = "production";
    delete process.env.COOKIE_DOMAIN;

    expect(getCookieBase()).toEqual({
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: undefined,
      path: "/",
    });
  });

  it("falls back to host-only cookies when COOKIE_DOMAIN is an empty string", () => {
    (process.env as { NODE_ENV: string }).NODE_ENV = "production";
    process.env.COOKIE_DOMAIN = "";

    expect(getCookieBase()).toEqual({
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: undefined,
      path: "/",
    });
  });

  it("allows overriding individual fields while keeping SameSite consistent", () => {
    (process.env as { NODE_ENV: string }).NODE_ENV = "production";
    process.env.COOKIE_DOMAIN = ".smartbudget-app.com";

    expect(getCookieBase({ httpOnly: false })).toEqual({
      httpOnly: false,
      secure: true,
      sameSite: "none",
      domain: ".smartbudget-app.com",
      path: "/",
    });
  });

  it("allows overriding domain explicitly", () => {
    (process.env as { NODE_ENV: string }).NODE_ENV = "production";
    process.env.COOKIE_DOMAIN = ".smartbudget-app.com";

    expect(getCookieBase({ domain: "custom.example.com" })).toEqual({
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: "custom.example.com",
      path: "/",
    });
  });
});
