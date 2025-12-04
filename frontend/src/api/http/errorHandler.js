export const handleApiError = (error) => {
  if (!error.response) {
    console.error("Network error");
  }

  // if (error.response?.status === 401) {
  //   localStorage.removeItem("auth_token");
  //   window.location.href = "/login";
  // }

  return Promise.reject(error);
};
