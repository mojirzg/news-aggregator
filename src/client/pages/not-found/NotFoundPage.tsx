import { useNavigate } from 'react-router-dom';
import { routes } from '@client/shared/config/routes';
import { Button } from '@client/shared/ui/Button';
import { EmptyState } from '@client/shared/ui/EmptyState';

export const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <main id="main-content" className="container" style={{ padding: '64px 0' }}>
      <EmptyState
        title="Page not found"
        description="The route does not exist or was moved."
        action={
          <Button
            type="button"
            onClick={() => {
              void navigate(routes.news);
            }}
          >
            Back to news
          </Button>
        }
      />
    </main>
  );
};
