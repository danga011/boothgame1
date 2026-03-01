import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  centered?: boolean;
}

export default function Layout({ children, centered = true }: LayoutProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: centered ? 'center' : 'stretch',
        justifyContent: centered ? 'center' : 'flex-start',
        padding: '24px',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
}
