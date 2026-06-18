import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#e8e8e8]">
      {/* Mobile banner */}
      <div className="relative w-full aspect-[9/11] min-h-[320px] max-h-[90vh] sm:hidden">
        <Link href="/produtos" className="block w-full h-full">
          <Image
            src="/banners/banner-mobile.png"
            alt="elle essencial"
            fill
            priority
            className="object-cover object-top"
            sizes="100vw"
          />
        </Link>
      </div>

      {/* Desktop banner */}
      <div className="relative w-full hidden sm:block aspect-[16/9] lg:aspect-[21/8] sm:min-h-[240px] lg:max-h-[680px]">
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
