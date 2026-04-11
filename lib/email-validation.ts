export const ALLOWED_EMAIL_DOMAINS = [
  "gmail.com",
  "outlook.com",
  "hotmail.com",
  "yahoo.com",
  "yahoo.fr",
  "live.com",
] as const;

export const EMAIL_PROVIDER_ERROR_MESSAGE =
  "Please use a valid email provider like : Gmail, Outlook, Yahoo...";

export const EMAIL_FORMAT_ERROR_MESSAGE = "Please enter a valid email address.";

const EMAIL_FORMAT_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const normalizeEmail = (email: string): string => email.trim().toLowerCase();

export const extractEmailDomain = (email: string): string => {
  const normalized = normalizeEmail(email);
  const atIndex = normalized.lastIndexOf("@");
  if (atIndex <= 0 || atIndex >= normalized.length - 1) {
    return "";
  }

  return normalized.slice(atIndex + 1);
};

export const isValidEmailFormat = (email: string): boolean =>
  EMAIL_FORMAT_REGEX.test(normalizeEmail(email));

export const isAllowedEmailProvider = (email: string): boolean =>
  ALLOWED_EMAIL_DOMAINS.includes(
    extractEmailDomain(email) as (typeof ALLOWED_EMAIL_DOMAINS)[number],
  );

export const validateTrustedEmail = (email: string) => {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !isValidEmailFormat(normalizedEmail)) {
    return {
      isValid: false,
      normalizedEmail,
      reason: "invalid_format" as const,
      message: EMAIL_FORMAT_ERROR_MESSAGE,
    };
  }

  if (!isAllowedEmailProvider(normalizedEmail)) {
    return {
      isValid: false,
      normalizedEmail,
      reason: "provider_not_allowed" as const,
      message: EMAIL_PROVIDER_ERROR_MESSAGE,
    };
  }

  return {
    isValid: true,
    normalizedEmail,
    reason: "" as const,
    message: "",
  };
};
