import helmet from 'helmet';

export const buildContentSecurityPolicyDirectives = () => ({
  defaultSrc: ["'self'"],
  baseUri: ["'self'"],
  connectSrc: ["'self'", 'https://*.ingest.sentry.io'],
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

export const createSecurityHeaders = () =>
  helmet({
    contentSecurityPolicy: {
      directives: buildContentSecurityPolicyDirectives(),
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  });
