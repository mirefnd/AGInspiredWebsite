/**
 * Uploads all photos from ~/Desktop/Faces/ to Supabase,
 * tagging each with collections: ["faces"].
 *
 * Usage: node scripts/upload-faces.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { readdir, readFile, stat } from "fs/promises";
import { join, extname, basename } from "path";
import exifr from "exifr";
import os from "os";

const SUPABASE_URL = "https://vhgcnbwtyteuuwznvhnw.supabase.co";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoZ2NuYnd0eXRldXV3em52aG53Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODkwOTc1MCwiZXhwIjoyMDk0NDg1NzUwfQ.X6-FQN02g9DaBYYeVitSSR1W9b7C6jleZoSBwA2BXQM";

const FACES_FOLDER = join(os.homedir(), "Desktop", "Places");
const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".JPG", ".JPEG", ".PNG", ".WEBP"]);

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

function getMimeType(filename) {
  const ext = extname(filename).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  return "image/jpeg";
}

async function getPhotoTimestamp(filePath) {
  try {
    const tags = await exifr.parse(filePath, ["DateTimeOriginal", "DateTime"]);
    if (tags?.DateTimeOriginal) return tags.DateTimeOriginal.toISOString();
    if (tags?.DateTime) return tags.DateTime.toISOString();
  } catch {
    // fall through to file stat
  }
  // Fallback: file birth time
  const info = await stat(filePath);
  return (info.birthtime || info.mtime).toISOString();
}

async function uploadPhoto(filePath, filename) {
  const buffer = await readFile(filePath);
  const contentType = getMimeType(filename);
  const timestamp = await getPhotoTimestamp(filePath);

  // 1. Upload file to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("photos")
    .upload(filename, buffer, {
      contentType,
      cacheControl: "31536000",
      upsert: false,
    });

  if (uploadError) {
    if (uploadError.message?.includes("already exists") || uploadError.statusCode === "409") {
      console.log(`  ⚠️  Skipped (already exists): ${filename}`);
      return;
    }
    throw new Error(`Storage upload failed: ${uploadError.message}`);
  }

  // 2. Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from("photos")
    .getPublicUrl(uploadData.path);

  // 3. Insert metadata into database
  const { error: insertError } = await supabase.rpc("insert_photo", {
    filename_arg: filename,
    url_arg: publicUrl,
    timestamp_arg: timestamp,
    collections_arg: ["places"],
  });

  if (insertError) {
    // Try to clean up uploaded file
    await supabase.storage.from("photos").remove([filename]);
    throw new Error(`DB insert failed: ${insertError.message}`);
  }

  console.log(`  ✓  ${filename} → ${timestamp}`);
}

async function main() {
  console.log(`\nUploading photos from: ${FACES_FOLDER}\n`);

  const entries = await readdir(FACES_FOLDER);
  const photos = entries.filter((f) => ALLOWED_EXTENSIONS.has(extname(f)));

  if (photos.length === 0) {
    console.log("No photos found.");
    return;
  }

  console.log(`Found ${photos.length} photo(s):\n`);
  let success = 0;
  let failed = 0;

  for (const filename of photos) {
    const filePath = join(FACES_FOLDER, filename);
    try {
      await uploadPhoto(filePath, filename);
      success++;
    } catch (err) {
      console.error(`  ✗  ${filename}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone — ${success} uploaded, ${failed} failed.\n`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
