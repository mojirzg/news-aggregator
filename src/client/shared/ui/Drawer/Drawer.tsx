import type {
  PointerEvent as ReactPointerEvent,
  ReactNode,
  TransitionEvent as ReactTransitionEvent,
} from 'react';
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './Drawer.module.css';
import { X } from 'lucide-react';

interface DrawerProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  description?: string;
  footer?: ReactNode;
  closeLabel?: string;
}

const EXIT_ANIMATION_DURATION_MS = 320;

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const getFocusableElements = (container: HTMLElement): HTMLElement[] =>
  [...container.querySelectorAll<HTMLElement>(focusableSelector)].filter(
    (element) =>
      !element.hasAttribute('hidden') &&
      element.getAttribute('aria-hidden') !== 'true',
  );

export const Drawer = ({
  open,
  title,
  onClose,
  children,
  description,
  footer,
  closeLabel = 'Close drawer',
}: DrawerProps) => {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const [isMounted, setIsMounted] = useState(open);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!open) {
      setIsVisible(false);
      return undefined;
    }

    setIsMounted(true);

    const animationFrame = window.requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [open]);

  useEffect(() => {
    if (open || !isMounted) return undefined;

    const timeout = window.setTimeout(() => {
      setIsMounted(false);
    }, EXIT_ANIMATION_DURATION_MS);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [isMounted, open]);

  useEffect(() => {
    if (!isMounted) return undefined;

    previouslyFocusedRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const body = document.body;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    return () => {
      body.style.overflow = previousOverflow;
      previouslyFocusedRef.current?.focus();
      previouslyFocusedRef.current = null;
    };
  }, [isMounted]);

  useEffect(() => {
    if (!open || !isMounted) return undefined;

    const dialog = dialogRef.current;

    if (!dialog) return undefined;

    const animationFrame = window.requestAnimationFrame(() => {
      const [firstFocusableElement] = getFocusableElements(dialog);
      (firstFocusableElement ?? dialog).focus();
    });

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements(dialog);
      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement = focusableElements.at(-1);

      if (!firstFocusableElement || !lastFocusableElement) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      if (event.shiftKey && document.activeElement === firstFocusableElement) {
        event.preventDefault();
        lastFocusableElement.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === lastFocusableElement) {
        event.preventDefault();
        firstFocusableElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMounted, onClose, open]);

  const handleBackdropPointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
  ): void => {
    if (event.button !== 0) return;
    onClose();
  };

  const handleDrawerTransitionEnd = (
    event: ReactTransitionEvent<HTMLElement>,
  ): void => {
    if (
      event.target !== event.currentTarget ||
      event.propertyName !== 'transform'
    )
      return;

    if (!open) {
      setIsMounted(false);
    }
  };

  if (!isMounted || typeof document === 'undefined') return null;

  const state = isVisible && open ? 'open' : 'closed';

  return createPortal(
    <div className={styles.root} data-state={state}>
      <div
        className={styles.backdrop}
        aria-hidden="true"
        onPointerDown={handleBackdropPointerDown}
      />

      <section
        ref={dialogRef}
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        onTransitionEnd={handleDrawerTransitionEnd}
      >
        <header className={styles.header}>
          <div className={styles.headingGroup}>
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className={styles.description}>
                {description}
              </p>
            ) : null}
          </div>

          <button
            className={styles.closeButton}
            type="button"
            aria-label={closeLabel}
            onClick={onClose}
          >
            <X />
          </button>
        </header>

        <div className={styles.content}>{children}</div>

        {footer ? <footer className={styles.footer}>{footer}</footer> : null}
      </section>
    </div>,
    document.body,
  );
};
