import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#e8e8e8]">
      <div className="relative w-full aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/8] min-h-[280px] sm:min-h-[240px] max-h-[85vh] lg:max-h-[680px]">
        <Link href="/produtos" className="block w-full h-full">
          <Image
            src="/banners/banner-basic.png"
            alt="elle essencial"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </Link>
      </div>
    </section>
  );
}
