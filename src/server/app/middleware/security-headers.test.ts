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

  it('ignores non-HTTP DSN schemes', () => {
    const directives = buildContentSecurityPolicyDirectives(
      'javascript:alert(1)',
    );

    expect(directives.connectSrc).toEqual(["'self'"]);
  });

  it('allowlists only the configured Sentry ingest origin', () => {
    const directives = buildContentSecurityPolicyDirectives(
      'https://public@example.ingest.sentry.io/42',
    );

    expect(directives?.connectSrc).toEqual([
      "'self'",
      'https://example.ingest.sentry.io',
    ]);
  });
});
