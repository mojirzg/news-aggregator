import helmet from 'helmet';

const getAllowedOrigin = (value?: string): string[] => {
  if (!value) return [];

  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:'
      ? [url.origin]
      : [];
  } catch {
    return [];
  }
};

export const buildContentSecurityPolicyDirectives = (sentryDsn?: string) => ({
  defaultSrc: ["'self'"],
  baseUri: ["'self'"],
  connectSrc: ["'self'", ...getAllowedOrigin(sentryDsn)],
  fontSrc: ["'self'"],
  formAction: ["'self'"],
  frameAncestors: ["'none'"],
  imgSrc: ["'self'", 'https:', 'data:'],
  manifestSrc: ["'self'"],
  objectSrc: ["'none'"],
  scriptSrc: ["'self'"],
  scriptSrcAttr: ["'none'"],
  styleSrc: ["'self'"],
  styleSrcAttr: ["'none'"],
});

export const createSecurityHeaders = (sentryDsn?: string) =>
  helmet({
    contentSecurityPolicy: {
      directives: buildContentSecurityPolicyDirectives(sentryDsn),
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  });
