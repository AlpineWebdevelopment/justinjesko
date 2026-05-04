import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      <span
        className="font-bold font-display text-white text-7xl"
        style={{ animation: "pulse-strong 1.2s ease-in-out infinite" }}
      >
        <Image
          src={"/jesko/logo/jesko_w.svg"}
          alt="Jesko"
          fill
          className="object-cover"
          priority
        />
      </span>
    </div>
  );
}
