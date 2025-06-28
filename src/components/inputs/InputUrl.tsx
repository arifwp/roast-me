"use client";

import clsx from "clsx";
import { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  onConfirm: (value: string) => void;
  className?: string;
}

export const InputUrl = ({
  placeholder = "Masukkan url",
  onConfirm,
  className,
  ...rest
}: Props) => {
  return (
    <input
      className={clsx("input-primary", className)}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onConfirm(e.target.value)
      }
      placeholder={placeholder}
      {...rest}
    />
  );
};
