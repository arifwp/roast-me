"use client";

import { useInputGroupStore } from "@/hooks/useInputGroup";
import { isValidGithubUrl, isValidLinkedInUrl } from "@/utils/urlValidation";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { DropdownUrl } from "./DropdownUrl";
import { InputFile } from "./inputs/InputFile";
import { InputUrl } from "./inputs/InputUrl";
import { SpinnerLoading } from "./SkeletonLoading";

interface InputVal {
  linkedinUrl?: string;
  githubUrl?: string;
  cv?: File | undefined;
}

export const InputGroup = () => {
  const { listInputs, initialize } = useInputGroupStore();

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
      const payload: InputVal = {
        linkedinUrl: data.linkedinUrl,
        githubUrl: data.githubUrl,
        cv: data.cv,
      };

      const res = await fetch("/api/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log("result", result);
    },
    onSuccess: () => {},
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
            clearErrors();
            handleSubmit(onSubmit)();
          }}
        >
          Submit
        </button>
      </div>

      {sendMutation.isPending && <SpinnerLoading className="mt-4" />}
    </>
  );
};
