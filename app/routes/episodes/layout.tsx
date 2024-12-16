import { Outlet } from "@remix-run/react";
import Layout from "~/components/Layout";

export default function EpisodeLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
