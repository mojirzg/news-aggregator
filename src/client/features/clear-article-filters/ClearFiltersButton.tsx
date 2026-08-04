import type { ButtonHTMLAttributes } from 'react';
import { Button } from '@client/shared/ui/Button';

export const ClearFiltersButton = (
  props: ButtonHTMLAttributes<HTMLButtonElement>,
) => (
  <Button variant="ghost" size="small" {...props}>
    Clear all
  </Button>
);
