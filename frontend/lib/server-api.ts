export const getServerApiBaseUrl = (): string => {
  const baseUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("API_URL or NEXT_PUBLIC_API_URL is not defined.");
  }

  return baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
};