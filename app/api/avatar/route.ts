import { existsSync } from "node:fs";
import { join } from "node:path";

export async function GET() {
  const available = existsSync(join(process.cwd(), "public", "avatar.glb"));
  return Response.json({ available });
}
