"use client";

import { cloneElement, useId, useState, type ReactElement } from "react";

interface TooltipProps {
  /** Empty/undefined content renders children with no tooltip at all. */
  content?: string;
  children: ReactElement<Record<string, unknown>>;
}

/**
 * Minimal hover/focus tooltip. Used for icon button labels and for
 * explaining why a disabled button is disabled (spec/foundations.md A2
 * "Buttons").
 */
export function Tooltip({ content, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const id = useId();

  if (!content) {
    return children;
  }

  const childProps = children.props;
  const trigger = cloneElement(children, {
    "aria-describedby": id,
    onMouseEnter: (e: React.MouseEvent) => {
      (childProps.onMouseEnter as ((e: React.MouseEvent) => void) | undefined)?.(e);
      setVisible(true);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      (childProps.onMouseLeave as ((e: React.MouseEvent) => void) | undefined)?.(e);
      setVisible(false);
    },
    onFocus: (e: React.FocusEvent) => {
      (childProps.onFocus as ((e: React.FocusEvent) => void) | undefined)?.(e);
      setVisible(true);
    },
    onBlur: (e: React.FocusEvent) => {
      (childProps.onBlur as ((e: React.FocusEvent) => void) | undefined)?.(e);
      setVisible(false);
    },
  } as Record<string, unknown>);

  return (
    <span className="relative inline-flex">
      {trigger}
      <span
        role="tooltip"
        id={id}
        hidden={!visible}
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-sm bg-ink px-2 py-1 text-small text-surface shadow-2"
      >
        {content}
      </span>
    </span>
  );
}
