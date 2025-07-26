"use client";

import { useInputGroupStore } from "@/hooks/useInputGroup";
import { isValidGithubUrl, isValidLinkedInUrl } from "@/utils/functions";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { DropdownUrl } from "./DropdownUrl";
import { InputFile } from "./inputs/InputFile";
import { InputUrl } from "./inputs/InputUrl";
import { SpinnerLoading } from "./SkeletonLoading";
import { TextBold } from "./TextBold";

interface InputVal {
  linkedinUrl?: string;
  githubUrl?: string;
  cv?: File | undefined;
}

export const InputGroup = () => {
  const { listInputs, initialize } = useInputGroupStore();
  const [roastResult, setRoastResult] = useState<string>("");

  useEffect(() => {
    initialize();
  }, [initialize]);

  const {
    formState: { errors },
    handleSubmit,
    clearErrors,
    setError,
    control,
  } = useForm<InputVal>();

  const sendMutation = useMutation({
    mutationFn: async (data: InputVal) => {
      const formData = new FormData();
      if (data.linkedinUrl) {
        formData.append("linkedinUrl", data.linkedinUrl);
      }

      if (data.githubUrl) {
        formData.append("githubUrl", data.githubUrl);
      }

      if (data.cv) {
        formData.append("cv", data.cv);
      }

      const res = await fetch("/api/process", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (result?.data) {
        setRoastResult(result?.data);
      }
    },
    onSuccess: () => { },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: InputVal) => {
    if (!data.linkedinUrl && !data.githubUrl && !data.cv) {
      setError("linkedinUrl", {
        type: "manual",
        message: "Minimal isi salah satu url atau upload cv kamu",
      });

      setError("githubUrl", {
        type: "manual",
        message: "Minimal isi salah satu url atau upload cv kamu",
      });

      setError("cv", {
        type: "manual",
        message: "Minimal isi salah satu url atau upload cv kamu",
      });
      return;
    }

    sendMutation.mutate(data);
  };

  return (
    <>
      <div className="gap-4 flex flex-col">
        {listInputs
          .sort((a, b) => {
            if (a.value === "cv") return -1;
            if (b.value !== "cv") return 1;
            return 0;
          })
          .map((item) => (
            <div key={item.id} className="text-start">
              <label htmlFor={item.value} className="label-primary">
                {item.name}
              </label>

              {item.value === "cv" ? (
                <Controller
                  name="cv"
                  control={control}
                  render={({ field }) => (
                    <InputFile
                      onFilesChange={(file) => {
                        field.onChange(file);
                      }}
                      disabled={sendMutation.isPending}
                    />
                  )}
                />
              ) : (
                <Controller
                  name={item.value}
                  control={control}
                  rules={{
                    validate: (value) => {
                      if (!value) return true;
                      if (
                        item.value === "linkedinUrl" &&
                        !isValidLinkedInUrl(value)
                      )
                        return "Harus URL LinkedIn yang valid";
                      if (
                        item.value === "githubUrl" &&
                        !isValidGithubUrl(value)
                      )
                        return "Harus URL GitHub yang valid";
                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <InputUrl
                      onConfirm={(value) => {
                        field.onChange(value);
                      }}
                      disabled={sendMutation.isPending}
                    />
                  )}
                />
              )}

              {errors[item.value] && (
                <p className="error-text" role="alert">
                  {`${errors[item.value]?.message}`}
                </p>
              )}
            </div>
          ))}
      </div>

      <div className="w-full mt-6 gap-4 flex items-center justify-center">
        <DropdownUrl disabled={sendMutation.isPending} />

        <button
          className="px-6 py-2 cursor-pointer rounded-md bg-(--color-secondary) hover:bg-(--color-secondary)/80 transition-colors duration-200 ease-in-out text-sm font-semibold text-(--color-brown-bold)"
          disabled={sendMutation.isPending}
          onClick={() => {
            setRoastResult('')
            clearErrors();
            handleSubmit(onSubmit)();
          }}
        >
          Roasting 🔥
        </button>
      </div>

      {sendMutation.isPending && <SpinnerLoading className="mt-4" />}

      <AnimatePresence mode="wait">
        {roastResult && !sendMutation.isPending && (
          <motion.div className={clsx("mt-8 text-sm text-start border border-(--color-brown-bold) rounded-lg p-4 text-black")} initial={{ y: 300, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 300, opacity: 0 }} transition={{ duration: 0.3 }}>
            <TextBold text={roastResult} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
