"use client";

import { useActionState } from "react";
import { TextField } from "../_components/text-field";
import { PasswordField } from "../_components/password-field";
import { Button } from "../_components/button";
import { signIn, type AuthActionState } from "../actions";

const initialState: AuthActionState = {};

// L01-FLD-EMAIL, L01-FLD-PASS, L01-BTN-SIGNIN, L01-LNK-RESET,
// L01-LNK-SIGNUP (spec/screens/landlord/L-01-sign-in.md).
export function SignInForm({ next }: { next: string }) {
  const [state, formAction, isPending] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />
      {state.error ? (
        <p className="text-small text-danger" role="alert">
          {state.error}
        </p>
      ) : null}
      <TextField
        label="Email"
        name="email"
        type="email"
        autoFocus
        required
        autoComplete="email"
      />
      <PasswordField label="Password" name="password" required autoComplete="current-password" />
      <Button type="submit" loading={isPending}>
        Sign in
      </Button>
      <div className="flex items-center justify-between text-small">
        <a href="/reset" className="text-primary">
          Forgot password
        </a>
        <a href="/signup" className="text-primary">
          Create an account
        </a>
      </div>
    </form>
  );
}
