import { notFound } from "next/navigation";

/**
 * Convention for routes under src/app/dev/** — call this first in every
 * dev-only page/layout. It 404s the route whenever the app is running in
 * a production build, so local-only tooling (e.g. /dev/components) never
 * becomes reachable once deployed.
 */
export function assertDevOnly(): void {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
}
