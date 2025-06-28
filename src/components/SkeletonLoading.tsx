import clsx from "clsx";

export const SpinnerLoading = ({
  title = "Loading...",
  subTitle = "Tunggu bentar ya, kami sedang nyiapin untuk kamu",
  className,
}: {
  title?: string;
  subTitle?: string;
  className?: string;
}) => {
  return (
    <div
      className={clsx("w-full p-8 gap-0 flex flex-col items-center", className)}
    >
      <div className="spinner-loader" />

      <p className="mt-4 text-sm text-(--color-brown-bold) text-center font-semibold">
        {title}
      </p>

      <p className="text-xs text-(--color-brown-bold)/60 text-center">
        {subTitle}
      </p>
    </div>
  );
};
