"use client";

import { supabaseClient } from "@/lib/supabase-client";

export default function ProjectUpload() {
  async function handleUpload(files: FileList | null) {
    if (!files) return;

    for (const file of Array.from(files)) {
      const path = `projects/${Date.now()}-${file.name}`;

      const { error } = await supabaseClient.storage
        .from("projects")
        .upload(path, file);

      if (error) continue;

      const { data } = supabaseClient.storage
        .from("projects")
        .getPublicUrl(path);

      if (data?.publicUrl) {
        const input = document.getElementById(
          "images-input",
        ) as HTMLInputElement;

        if (input) {
          const current = input.value ? JSON.parse(input.value) : [];

          input.value = JSON.stringify([...current, data.publicUrl]);
        }
      }
    }
  }

  return (
    <input
      type="file"
      multiple
      onChange={(e) => handleUpload(e.target.files)}
    />
  );
}
