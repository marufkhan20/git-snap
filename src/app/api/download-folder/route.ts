/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import JSZip from "jszip";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { repoUrl } = await req.json();
    if (!repoUrl) {
      return NextResponse.json({ error: "Invalid URL." }, { status: 400 });
    }

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

    const zip = new JSZip();
    await Promise.all(
      response.data.map(async (file: any) => {
        if (file.type === "file") {
          const fileContent = await axios.get(file.download_url);
          zip.file(file.name, fileContent.data);
        }
      })
    );

    const content = await zip.generateAsync({ type: "nodebuffer" });

    return new NextResponse(content, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename=repository.zip`,
      },
    });
  } catch (error) {
    console.error("Error downloading folder:", error);
    return NextResponse.json(
      { error: "Failed to download folder." },
      { status: 500 }
    );
  }
}
