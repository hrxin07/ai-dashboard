export const instant = false;

import { AppNav } from "@/components/app-nav";
import { getCurrentAuthUser } from "@/lib/current-user";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentAuthUser();

  // proxy.ts redirects anonymous visitors before this layout is rendered.
  // This fallback avoids accidentally rendering protected UI in a future route.
  if (!user) return null;

  return <div className="app-shell"><AppNav user={user} /><main className="app-content">{children}</main></div>;
}


