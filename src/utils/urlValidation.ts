export const isValidLinkedInUrl = (url: string): boolean => {
  try {
    const u = new URL(url);
    return u.hostname.includes("linkedin.com");
  } catch {
    return false;
  }
};

export const isValidGithubUrl = (url: string): boolean => {
  try {
    const u = new URL(url);
    return u.hostname === "github.com" || u.hostname.endsWith(".github.com");
  } catch {
    return false;
  }
};
