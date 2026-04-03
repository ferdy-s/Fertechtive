"use client";

import { useEffect, useState } from "react";

type PickedImages = {
  thumbnail: File | null;
  gallery: File[];
};

type FilePickerProps = {
  name: string;
  maxBytes: number;
  maxFiles: number;
  onChange?: (data: PickedImages) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function FilePicker({
  name,
  maxBytes,
  maxFiles,
  onChange = () => {},
}: FilePickerProps) {
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);

  /* CLEANUP URL */
  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  return (
    <label className="grid gap-3 text-sm">
      <span className="opacity-85">Images (thumbnail + slider)</span>

      {/* ✅ NATIVE FILE INPUT (JANGAN DIHILANGKAN) */}
      <input
        type="file"
        name={name}
        multiple
        accept="image/jpeg,image/png,.jpg,.jpeg,.png"
        className="rounded-lg border border-white/15 bg-black/40 px-3 py-2 outline-none
          file:mr-3 file:rounded-md file:border-0
          file:bg-white/10 file:px-3 file:py-2 file:text-sm
          hover:file:bg-white/20"
        onChange={(e) => {
          const files = Array.from(e.currentTarget.files ?? []);

          if (!files.length) {
            setPreviews([]);
            onChange({ thumbnail: null, gallery: [] });
            return;
          }

          if (files.length > maxFiles) {
            alert(`Maksimal ${maxFiles} file.`);
            e.currentTarget.value = "";
            return;
          }

          let totalSize = 0;
          for (const file of files) {
            totalSize += file.size;
            if (file.size > maxBytes) {
              alert(
                `"${file.name}" melebihi ${Math.floor(
                  maxBytes / (1024 * 1024),
                )}MB.`,
              );
              e.currentTarget.value = "";
              return;
            }
          }

          if (totalSize > 20 * 1024 * 1024) {
            alert("Total ukuran file melebihi 20MB.");
            e.currentTarget.value = "";
            return;
          }

          const mapped = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
          }));

          setPreviews(mapped);

          const [thumbnail, ...gallery] = files;
          onChange({ thumbnail, gallery });
        }}
      />

      {/* ✅ PREVIEW (TAMBAHAN, TIDAK MENGGANGGU FORM) */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {previews.map((p, i) => (
            <div
              key={i}
              className="relative aspect-square overflow-hidden rounded-lg
              border border-white/10 bg-[#10131A]"
            >
              <img
                src={p.url}
                alt={`preview-${i}`}
                className="h-full w-full object-cover"
              />

              {i === 0 && (
                <span
                  className="absolute bottom-2 left-2
                rounded-full bg-white/90 px-2 py-0.5
                text-[10px] font-medium text-black"
                >
                  Thumbnail
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <span className="text-xs opacity-60 leading-relaxed">
        File pertama = thumbnail, sisanya = slider.
        <br />
        Maks {Math.floor(maxBytes / (1024 * 1024))}MB per file, maksimal{" "}
        {maxFiles} file, total ≤ 20MB.
      </span>
    </label>
  );
}
