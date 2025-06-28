import { Footer } from "@/components/Footer";
import { InputGroup } from "@/components/InputGroup";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full flex flex-col min-h-screen">
      <main className="p-8 flex flex-col text-center items-center justify-center">
        <div className="w-full max-w-2xl mx-auto text-center">
          <Image
            className="w-60 h-60 object-contain mx-auto"
            width={400}
            height={400}
            src={"/images/app_logo.png"}
            alt="Logo Roast Me"
          />

          <InputGroup />
        </div>
      </main>
      <Footer />
    </div>
  );
}
