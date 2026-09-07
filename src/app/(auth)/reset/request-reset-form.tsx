"use client";

import { useActionState } from "react";
import { TextField } from "../_components/text-field";
import { Button } from "../_components/button";
import { requestReset, type ResetActionState } from "../actions";

const initialState: ResetActionState = { submitted: false };

export function RequestResetForm() {
  const [state, formAction, isPending] = useActionState(requestReset, initialState);

  if (state.submitted) {
    return (
      <p className="text-body text-ink">
        If that email has an account, we have sent a link to reset the password.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <TextField label="Email" name="email" type="email" required autoComplete="email" />
      <Button type="submit" loading={isPending}>
        Send reset link
      </Button>
    </form>
  );
}
