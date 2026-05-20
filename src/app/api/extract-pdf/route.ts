import { NextResponse } from "next/server";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { PDFParse } from "pdf-parse";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const PDF_WORKER_SRC = pathToFileURL(
  path.join(process.cwd(), "node_modules/pdf-parse/dist/pdf-parse/esm/pdf.worker.mjs")
).toString();

PDFParse.setWorker(PDF_WORKER_SRC);

export async function POST(req: Request) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Upload a PDF file." }, { status: 400 });
  }

  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json(
      { error: "PDF is too large. Upload a file under 10MB." },
      { status: 413 }
    );
  }

  const name = file.name.toLowerCase();
  const isPdf = file.type === "application/pdf" || name.endsWith(".pdf");
  if (!isPdf) {
    return NextResponse.json({ error: "Only PDF files can be extracted here." }, { status: 400 });
  }

  let parser: PDFParse | null = null;
  try {
    const data = new Uint8Array(await file.arrayBuffer());
    parser = new PDFParse({ data });
    const result = await parser.getText({ pageJoiner: "" });
    const text = result.text.replace(/\s+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();

    if (!text) {
      return NextResponse.json(
        { error: "No readable text was found in this PDF." },
        { status: 422 }
      );
    }

    return NextResponse.json({
      text,
      fileName: file.name,
      pages: result.total ?? null,
    });
  } catch (err) {
    console.error("PDF extraction failed:", err);
    return NextResponse.json(
      { error: "Could not read this PDF. Try a text-based PDF or paste the text directly." },
      { status: 422 }
    );
  } finally {
    await parser?.destroy();
  }
}
