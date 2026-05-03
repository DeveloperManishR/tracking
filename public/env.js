window.__APP_ENV_PROMISE__ = fetch("/api/public-env", {
  headers: {
    Accept: "application/json",
  },
})
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load runtime environment variables");
    }

    return response.json();
  })
  .catch((error) => {
    console.error(error);
    return {};
  });