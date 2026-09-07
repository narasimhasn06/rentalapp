"use client";

import { useActionState, useState } from "react";
import { TextField } from "../_components/text-field";
import { PasswordField } from "../_components/password-field";
import { Button } from "../_components/button";
import { signUp, type AuthActionState } from "../actions";
import { passwordStrengthLabel } from "../_components/password-strength";

const initialState: AuthActionState = {};

export function SignUpForm() {
  const [state, formAction, isPending] = useActionState(signUp, initialState);
  const [password, setPassword] = useState("");
  const strength = passwordStrengthLabel(password);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error ? (
        <p className="text-small text-danger" role="alert">
          {state.error}
        </p>
      ) : null}
      <TextField label="Email" name="email" type="email" required autoComplete="email" />
      <PasswordField
        label="Password"
        name="password"
        required
        minLength={8}
        autoComplete="new-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      {password ? <p className="text-small text-muted">Strength: {strength}</p> : null}
      <Button type="submit" loading={isPending}>
        Create account
      </Button>
      <a href="/signin" className="text-center text-small text-primary">
        Already have an account? Sign in
      </a>
    </form>
  );
}
