"use client";

import { PencilSquareIcon, PhotoIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  onFilesChange: (files: File | undefined) => void;
  disabled?: boolean;
}

export const InputFile = ({ onFilesChange, disabled = false }: Props) => {
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | undefined>(
    undefined
  );
  const inputRef = useRef<HTMLInputElement | null>(null);
  const MAX_SIZE = 2 * 1024 * 1024; // 2MB
  const allowedTypes = ["application/pdf"];

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast.error("Terjadi kesalahan, coba lagi beberapa saat lagi");
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      toast.error("Format tidak valid. Hanya PDF yang diizinkan");
      return;
    }

    if (file.size > MAX_SIZE) {
      toast.error("Ukuran file ga boleh melebihi 2MB");
      return;
    }

    try {
      const base64 = await readFileAsBase64(file);

      if (!base64.startsWith("data:application/pdf")) {
        toast.error("Gagal memproses preview PDF");
        return;
      }

      setPdfPreviewUrl(base64);
      onFilesChange(file);
    } catch (err) {
      console.error(err);
      toast.error("Terjadi error saat membaca file");
    }
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (reader.result) {
          resolve(reader.result as string);
        } else {
          reject("Gagal membaca file");
        }
      };

      reader.onerror = () => reject("Error saat membaca file");
      reader.readAsDataURL(file);
    });
  };

  const handleOpenInput = () => {
    if (disabled) return;

    inputRef.current?.click();
  };

  return (
    <>
      <div
        className={clsx(
          "mt-2 p-4 rounded-2xl border border-dashed border-(--color-brown-bold) flex flex-col items-center justify-center",
          {
            "cursor-pointer hover:bg-(--color-secondary)/20": !pdfPreviewUrl,
          }
        )}
        onClick={!pdfPreviewUrl ? handleOpenInput : undefined}
      >
        {pdfPreviewUrl ? (
          <iframe
            src={pdfPreviewUrl}
            className="w-full h-80 rounded-md"
            title="PDF Preview"
          />
        ) : (
          <>
            <PhotoIcon className="size-12" />
            <h1 className="text-md text-(--color-brown-bold) font-semibold">
              Drop your CV here, or browse
            </h1>
            <h3 className="text-xs text-(--color-brown-bold)/50">PDF only</h3>
          </>
        )}

        {pdfPreviewUrl && (
          <button
            className="px-6 py-2 mt-4 gap-2 rounded-md flex items-center hover:bg-(--color-secondary)/80 text-sm cursor-pointer transition-colors duration-200 ease-in-out font-semibold self-end"
            onClick={handleOpenInput}
            type="button"
          >
            Ganti
            <PencilSquareIcon className="size-4 text-(--color-brown-gold)" />
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        className="hidden"
        name="imgUpload"
        type="file"
        onChange={handleFileChange}
        accept="application/pdf"
        disabled={disabled}
      />
    </>
  );
};
