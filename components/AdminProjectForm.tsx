"use client";

import ProjectUpload from "@/components/ProjectUpload";
import { upsertProject } from "@/app/admin/projects/actions";

export default function AdminProjectForm() {
  return (
    <form action={upsertProject} className="grid gap-4">
      <input name="title" placeholder="Title" />

      {/* Upload */}
      <ProjectUpload />

      {/* Hidden input untuk simpan URL */}
      <input type="hidden" name="images" id="images-input" />

      <button>Save</button>
    </form>
  );
}
