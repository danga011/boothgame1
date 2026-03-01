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
  className,
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
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    width: fullWidth ? '100%' : 'auto',
    padding: '0 32px',
    minWidth: '120px',
    position: 'relative',
    overflow: 'hidden',
    WebkitTapHighlightColor: 'transparent',
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
      color: '#0f172a',
      fontWeight: 700,
      boxShadow: `0 4px 14px ${colors.glowPrimary}, 0 1px 3px rgba(0,0,0,0.2)`,
      letterSpacing: '0.3px',
    },
    secondary: {
      background: colors.bgSurface,
      color: colors.textPrimary,
      border: `2px solid ${colors.border}`,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    },
    ghost: {
      background: 'transparent',
      color: colors.textSecondary,
    },
    option: {
      background: selected
        ? `linear-gradient(135deg, ${colors.primary}18, ${colors.primary}30)`
        : colors.bgSurface,
      color: colors.textPrimary,
      border: `2px solid ${selected ? colors.primary : colors.border}`,
      height: 'auto',
      minHeight: sizes.buttonHeight,
      padding: '16px 20px',
      textAlign: 'left' as const,
      justifyContent: 'flex-start' as const,
      fontSize: sizes.fontBase,
      boxShadow: selected
        ? `0 0 20px ${colors.glowPrimary}, inset 0 1px 0 ${colors.primary}22`
        : '0 2px 8px rgba(0,0,0,0.1)',
      lineHeight: '1.5',
    },
  };

  const mergedClassName = [
    className,
    selected && variant === 'option' ? 'option-selected' : '',
  ].filter(Boolean).join(' ');

  return (
    <button
      className={mergedClassName || undefined}
      style={{ ...base, ...variants[variant], ...style }}
      {...props}
    >
      {children}
    </button>
  );
}
