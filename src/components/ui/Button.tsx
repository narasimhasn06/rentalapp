"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Spinner } from "./Spinner";
import { Tooltip } from "./Tooltip";

export type ButtonVariant = "primary" | "secondary" | "quiet" | "danger";
export type ButtonHeight = "default" | "compact" | "tenant";

const heightClasses: Record<ButtonHeight, string> = {
  default: "h-10 px-4 text-[14px] leading-5", // 40px, spec/foundations.md A2
  compact: "h-8 px-3 text-small", // 32px, table rows
  tenant: "h-12 px-5 text-[14px] leading-5", // 48px, tenant touch target
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-surface hover:bg-ink",
  secondary: "border border-primary bg-surface text-primary hover:bg-primary-soft",
  quiet: "text-body hover:bg-canvas",
  danger: "border border-danger bg-surface text-danger hover:bg-danger/12",
};

interface CommonProps {
  variant?: ButtonVariant;
  height?: ButtonHeight;
  /** Network call in progress: shows an inline spinner, stays disabled. */
  loading?: boolean;
  /** Required whenever the button is disabled — shown as a tooltip explaining why. */
  disabledReason?: string;
  className?: string;
}

export interface ButtonProps
  extends CommonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  children: ReactNode;
}

/**
 * A2 "Buttons" (spec/foundations.md): five variants — primary, secondary,
 * quiet, danger, and icon (see IconButton below). Disabled buttons must
 * pass `disabledReason` so the reason surfaces as a tooltip rather than
 * silently doing nothing.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    height = "default",
    loading = false,
    disabledReason,
    className = "",
    disabled,
    children,
    ...rest
  },
  ref,
) {
  const isDisabled = Boolean(disabled) || loading;

  const button = (
    <button
      ref={ref}
      type="button"
      disabled={isDisabled}
      aria-disabled={isDisabled}
      className={`inline-flex items-center justify-center gap-2 rounded-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${heightClasses[height]} ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {loading && <Spinner size={16} />}
      {children}
    </button>
  );

  if (isDisabled && disabledReason) {
    return <Tooltip content={disabledReason}>{button}</Tooltip>;
  }
  return button;
});

export interface IconButtonProps
  extends CommonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> {
  icon: ReactNode;
  /** Accessible name AND the tooltip text — icon buttons must carry both (spec/foundations.md A2). */
  label: string;
}

/**
 * A2 "Icon" button variant: 32×32, icon only, always tooltipped with its
 * accessible label. Row-level icon actions (call, copy, share, print)
 * should stop propagation themselves when used inside a DataTable row —
 * see DataTableActions.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { icon, label, loading = false, disabledReason, className = "", disabled, ...rest },
    ref,
  ) {
    const isDisabled = Boolean(disabled) || loading;

    return (
      <Tooltip content={isDisabled ? disabledReason ?? label : label}>
        <button
          ref={ref}
          type="button"
          aria-label={label}
          disabled={isDisabled}
          aria-disabled={isDisabled}
          className={`inline-flex h-8 w-8 items-center justify-center rounded-sm text-body transition-colors hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
          {...rest}
        >
          {loading ? <Spinner size={16} /> : icon}
        </button>
      </Tooltip>
    );
  },
);
