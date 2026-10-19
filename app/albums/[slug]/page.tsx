import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";

import AlbumClient from "./AlbumClient";
import { auth } from "../../../lib/auth";
import { sql } from "../../../lib/db";

export const dynamic = "force-dynamic";

export default async function AlbumPage({ params }: { params: { slug: string } }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const albums = await sql`
    SELECT a.id
    FROM albums a
    INNER JOIN user_albums ua ON ua.album_id = a.id
    WHERE a.slug = ${params.slug}
      AND ua.user_id = ${session.user.id}
    LIMIT 1
  `;

  if (albums.length === 0) {
    notFound();
  }

  return <AlbumClient />;
}
