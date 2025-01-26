import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { repoUrl } = await req.json();
    if (!repoUrl) {
      return NextResponse.json({ error: "Invalid URL." }, { status: 400 });
    }

    // Extract owner, repo, and folder path from the URL
    const match = repoUrl.match(
      /github\.com\/([^/]+)\/([^/]+)\/tree\/[^/]+\/(.+)/
    );
    if (!match) {
      return NextResponse.json(
        { error: "Invalid GitHub folder URL." },
        { status: 400 }
      );
    }

    const [, owner, repo, path] = match;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

    const response = await axios.get(apiUrl, {
      headers: { Accept: "application/vnd.github.v3+json" },
    });

    const files = response.data.map((file: { name: string }) => file.name);
    return NextResponse.json({ files });
  } catch (error) {
    console.error("Error fetching files:", error);
    return NextResponse.json(
      { error: "Failed to fetch files." },
      { status: 500 }
    );
  }
}
