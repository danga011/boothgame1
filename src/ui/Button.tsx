import type { ButtonHTMLAttributes } from 'react';
import { colors, sizes } from './theme';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'option';
  fullWidth?: boolean;
  selected?: boolean;
}

export default function Button({
  variant = 'primary',
  fullWidth = false,
  selected = false,
  style,
  children,
  ...props
}: ButtonProps) {
  const base: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: sizes.buttonHeight,
    borderRadius: sizes.buttonRadius,
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: sizes.fontMd,
    transition: 'all 0.15s ease',
    width: fullWidth ? '100%' : 'auto',
    padding: '0 32px',
    minWidth: '120px',
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
      color: '#fff',
    },
    secondary: {
      background: colors.bgCard,
      color: colors.textPrimary,
      border: `2px solid ${colors.border}`,
    },
    ghost: {
      background: 'transparent',
      color: colors.textSecondary,
    },
    option: {
      background: selected
        ? `linear-gradient(135deg, ${colors.primary}22, ${colors.primary}44)`
        : colors.bgSurface,
      color: colors.textPrimary,
      border: `2px solid ${selected ? colors.primary : colors.border}`,
      height: 'auto',
      minHeight: sizes.buttonHeight,
      padding: '16px 24px',
      textAlign: 'left' as const,
      justifyContent: 'flex-start' as const,
      fontSize: sizes.fontBase,
    },
  };

  return (
    <button
      style={{ ...base, ...variants[variant], ...style }}
      {...props}
    >
      {children}
    </button>
  );
}
