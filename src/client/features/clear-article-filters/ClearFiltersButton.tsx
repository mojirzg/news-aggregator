import type { ButtonHTMLAttributes } from 'react';
import { Button } from '@client/shared/ui/Button';
import { ListRestart } from 'lucide-react';

export const ClearFiltersButton = (
  props: ButtonHTMLAttributes<HTMLButtonElement>,
) => (
  <Button variant="ghost" size="small" {...props}>
    <ListRestart />
  </Button>
);
