import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/villaggio")({
  component: VillaggioLayout,
});

function VillaggioLayout() {
  return <Outlet />;
}
