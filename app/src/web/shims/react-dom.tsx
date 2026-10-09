// createPortal(…, document.body) dell'app web → Portal nativo (@rn-primitives/portal), reso nel
// PortalHost alla radice dell'app (_layout.tsx): stesso effetto "sopra a tutto" su web e telefono.
import { Portal } from '@rn-primitives/portal';
import { useId, type ReactNode } from 'react';

function PortalShim({ children }: { children: ReactNode }) {
  const name = useId();
  return <Portal name={name}>{children}</Portal>;
}

export function createPortal(children: ReactNode, _container?: unknown, key?: string | null) {
  return <PortalShim key={key ?? undefined}>{children}</PortalShim>;
}

export function flushSync<T>(fn: () => T): T {
  return fn();
}
