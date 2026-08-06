import { describe, expect, it } from 'vitest';
import { buildContentSecurityPolicyDirectives } from './security-headers';

describe('content security policy', () => {
  it('does not allow inline scripts or styles', () => {
    const directives = buildContentSecurityPolicyDirectives();

    expect(directives?.scriptSrc).toEqual(["'self'"]);
    expect(directives?.styleSrc).toEqual(["'self'"]);
    expect(directives?.scriptSrcAttr).toEqual(["'none'"]);
    expect(directives?.styleSrcAttr).toEqual(["'none'"]);
  });

  it('allows the standard Sentry ingest endpoint for optional client errors', () => {
    const directives = buildContentSecurityPolicyDirectives();

    expect(directives.connectSrc).toEqual([
      "'self'",
      'https://*.ingest.sentry.io',
    ]);
  });
});
