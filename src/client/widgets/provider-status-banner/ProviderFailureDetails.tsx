import type { ProviderResult } from '@contracts/index';
import { providerOptions } from '@client/shared/config/constants';

export const ProviderFailureDetails = ({
  providers,
}: {
  providers: ProviderResult[];
}) => {
  const failedNames = providers
    .filter((provider) => provider.status === 'error')
    .map(
      (provider) =>
        providerOptions.find((option) => option.id === provider.providerId)
          ?.label ?? provider.providerId,
    );
  return <span>{failedNames.join(', ')} did not respond.</span>;
};
