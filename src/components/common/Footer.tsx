import Image from "next/image";
import Link from "next/link";

function Footer() {
  return (
    <div className="mt-16 flex flex-col item-center gfap-8 md:flex-row md:items-start md:justify-between md:gap-0 bg-gray-800 rounded-lg p-8">
      <div className="flex flex-col gap-4 items-center md:items-start">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={36}
            height={36}
            className="w-6 h-6 md:h-9"
          />
          <p className="hidden md:block text-md font-medium tracking-wider text-white">
            E-Commerce
          </p>
        </Link>
        <p className="text-sm text-gray-400">&copy; 2025 E-Commerce</p>
        <p className="text-sm text-gray-400">
          Built with Next.js and Tailwind CSS. All rights reserved.
        </p>
      </div>
      <div className="flex flex-col gap-4 text-sm text-gray-400 items-center md:items-start">
        <p className="text-sm text-amber-50">Links</p>
        <Link href="/">Homepage</Link>
        <Link href="/">Contact</Link>
        <Link href="/">Terms of Service</Link>
        <Link href="/">Privacy Policy</Link>
      </div>
      <div className="flex flex-col gap-4 text-sm text-gray-400 items-center md:items-start">
        <p className="text-sm text-amber-50">Links</p>
        <Link href="/">All Products</Link>
        <Link href="/">New Arrivals</Link>
        <Link href="/">Best Sellers</Link>
        <Link href="/">Sale</Link>
      </div>
      <div className="flex flex-col gap-4 text-sm text-gray-400 items-center md:items-start">
        <p className="text-sm text-amber-50">Links</p>
        <Link href="/">About</Link>
        <Link href="/">Contact</Link>
        <Link href="/">Blog</Link>
        <Link href="/">Affiliate Program</Link>
      </div>
    </div>
  );
}

export default Footer;
