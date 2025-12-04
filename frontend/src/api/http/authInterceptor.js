export const authInterceptor = (config) => {
  const token = localStorage.getItem("auth_token");

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
};
