export const MOCK_JWT_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxZTg5YjM0NC1mYWQ4LTRiZjctYWViNy0zOWU4MTAwZGRiODAiLCJlbWFpbCI6InNhbXVlbEBlbWFpbC5jb20iLCJuYW1lIjoiU2FtdWVsIEJhbmNvIiwianRpIjoiMTc4NDk5ZTYtNzUwNi00OWU0LWJlMjgtNmZmZDg4MmVmYWNlIiwiZXhwIjoxNzgxMDM0NzMyLCJpc3MiOiJTbWFydEJ1ZGdldFBybyIsImF1ZCI6IlNtYXJ0QnVkZ2V0UHJvLkZyb250ZW5kIn0.qq48GTsVoAa0xlRM_qTcwih8be-9I9FeUMfzCqV-l20";

export const withMockAuth = (init?: RequestInit): RequestInit => {
  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${MOCK_JWT_TOKEN}`);

  return {
    ...init,
    headers,
  };
};

export const authFetch = (input: RequestInfo | URL, init?: RequestInit) => {
  return fetch(input, withMockAuth(init));
};
