"use client";

import { useActionState } from "react";
import { PasswordField } from "../_components/password-field";
import { Button } from "../_components/button";
import { updatePassword, type AuthActionState } from "../actions";

const initialState: AuthActionState = {};

export function NewPasswordForm() {
  const [state, formAction, isPending] = useActionState(updatePassword, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error ? (
        <p className="text-small text-danger" role="alert">
          {state.error}
        </p>
      ) : null}
      <PasswordField
        label="New password"
        name="password"
        required
        minLength={8}
        autoComplete="new-password"
      />
      <Button type="submit" loading={isPending}>
        Set new password
      </Button>
    </form>
  );
}
