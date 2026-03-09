'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/50 backdrop-blur-md bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{"DevMetrics"}</h1>
            <p className="text-xs text-slate-400">Powered by FastSpring</p>
          </div>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm transition-colors ${
              pathname === '/'
                ? 'text-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Home
          </Link>
          <Link
            href="/store"
            className={`text-sm transition-colors ${
              pathname === '/store'
                ? 'text-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Store
          </Link>
        </nav>
      </div>
    </header>
  );
}
