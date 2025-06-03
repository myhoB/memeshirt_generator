import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-[#0B3954] text-[#FEFFFE] py-4 px-8 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="MemeShirt Logo"
            width={0}
            height={0}
            sizes="100vw"
            className="rounded-full w-auto h-auto scale-80"
            priority
            unoptimized
          />
        </Link>
        <nav className="py-4">
          <ul className="flex space-x-12">
            <li>
              <Link href="/" className="hover:text-[#BFD7EA] transition-colors text-xl">
                Designer
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:text-[#BFD7EA] transition-colors text-xl">
                Gallery
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-[#BFD7EA] transition-colors text-xl">
                About
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
} 