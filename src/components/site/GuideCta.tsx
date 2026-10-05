import Link from "next/link";
import Image from "next/image";
import type { Guide } from "@/lib/guides";

export default function GuideCta({ guide }: { guide: Guide }) {
  return (
    <aside className="mt-16 border border-gray-200 bg-white p-6 md:p-8 flex flex-col sm:flex-row gap-6 items-center">
      <div className="relative w-full sm:w-56 shrink-0 aspect-video border border-gray-200">
        <Image src={guide.cover} alt={guide.title} fill sizes="224px" className="object-cover" />
      </div>
      <div className="space-y-3 text-center sm:text-left">
        <p className="text-[10px] tracking-[0.3em] uppercase text-medsol-blue">Free guide · PDF</p>
        <h3 className="text-xl font-serif text-gray-900 leading-snug">{guide.title}</h3>
        <p className="text-gray-600 text-sm font-light leading-relaxed">{guide.description}</p>
        <Link
          href={`/guides/${guide.slug}`}
          className="inline-block mt-2 px-8 py-3 bg-medsol-blue text-white text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-medsol-gold transition-colors duration-500"
        >
          Get the free guide
        </Link>
      </div>
    </aside>
  );
}
