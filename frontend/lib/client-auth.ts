type AuthUser = {
  userId: string;
  name: string;
  email: string;
  isPremium: boolean;
};

export const setClientUserDataCookie = (user: AuthUser) => {
  const value = encodeURIComponent(JSON.stringify(user));

  document.cookie = `user-data=${value}; path=/; samesite=lax`;
};