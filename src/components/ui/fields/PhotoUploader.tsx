"use client";

import { useId, useRef, useState } from "react";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];
const MAX_FILE_BYTES = 6 * 1024 * 1024; // spec/screens/shared/S-04's "6MB phone photo" example

interface UploadItem {
  id: string;
  file: File;
  previewUrl: string;
  progress: number;
  error?: string;
}

export interface PhotoUploaderProps {
  label?: string;
  /** 3 on tenant screens, 10 on landlord screens (spec/screens/shared/S-04). */
  maxPhotos: number;
  onPhotosChange?: (files: File[]) => void;
}

/**
 * S-04 "Photo uploader". No storage backend exists yet (out of scope —
 * see CLAUDE.md "Out of scope until a schema ticket lands"), so the
 * upload progress here is simulated client-side purely to demonstrate
 * the states the spec describes: immediate local thumbnail, progress
 * ring, and an inline error on the thumbnail itself.
 */
export function PhotoUploader({ label = "Photos", maxPhotos, onPhotosChange }: PhotoUploaderProps) {
  const [items, setItems] = useState<UploadItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    const room = Math.max(maxPhotos - items.length, 0);
    const incoming = Array.from(fileList).slice(0, room);

    const newItems: UploadItem[] = incoming.map((file) => {
      let error: string | undefined;
      if (!ACCEPTED_TYPES.includes(file.type)) {
        error = "That file type is not supported";
      } else if (file.size > MAX_FILE_BYTES) {
        error = "That file is too large";
      }
      return {
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        file,
        previewUrl: URL.createObjectURL(file),
        progress: 0,
        error,
      };
    });

    const nextItems = [...items, ...newItems];
    setItems(nextItems);
    onPhotosChange?.(nextItems.filter((item) => !item.error).map((item) => item.file));

    newItems.filter((item) => !item.error).forEach((item) => simulateUpload(item.id));
  }

  function simulateUpload(itemId: string) {
    const interval = setInterval(() => {
      setItems((current) =>
        current.map((item) =>
          item.id === itemId && !item.error
            ? { ...item, progress: Math.min(item.progress + 20, 100) }
            : item,
        ),
      );
    }, 150);
    setTimeout(() => clearInterval(interval), 1000);
  }

  function removeItem(itemId: string) {
    setItems((current) => {
      const next = current.filter((item) => item.id !== itemId);
      onPhotosChange?.(next.filter((item) => !item.error).map((item) => item.file));
      return next;
    });
  }

  const atLimit = items.length >= maxPhotos;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-label uppercase text-muted">{label}</span>
      <div className="flex flex-wrap gap-3">
        {items.map((item) => (
          <div key={item.id} className="relative h-20 w-20 overflow-hidden rounded-sm border border-line">
            {/* Local blob preview — next/image doesn't serve blob: URLs. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.previewUrl} alt="" className="h-full w-full object-cover" />
            {!item.error && item.progress < 100 && (
              <div className="absolute inset-0 flex items-center justify-center bg-ink/40">
                <span className="text-small font-semibold text-surface">{item.progress}%</span>
              </div>
            )}
            {item.error && (
              <div className="absolute inset-0 flex items-center justify-center bg-danger/12 p-1 text-center">
                <span className="text-small font-semibold text-danger">{item.error}</span>
              </div>
            )}
            <button
              type="button"
              aria-label="Remove photo"
              onClick={() => removeItem(item.id)}
              className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink/60 text-surface"
            >
              ×
            </button>
          </div>
        ))}
        {!atLimit && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-sm border border-dashed border-line text-muted hover:border-primary hover:text-primary"
          >
            <span aria-hidden="true" className="text-h2">
              +
            </span>
            <span className="text-small">Add</span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        multiple
        hidden
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <p className="text-small text-muted">
        Up to {maxPhotos} photo{maxPhotos === 1 ? "" : "s"}.
      </p>
    </div>
  );
}
