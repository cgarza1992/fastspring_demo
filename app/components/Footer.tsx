export default function Footer() {
  return (
    <footer className="border-t border-slate-800/50 py-12 px-6 bg-gradient-to-b from-transparent to-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand column */}
          <div className="md:col-span-1">
            <div className="mb-3">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{"DevMetrics"}</span>
              <p className="text-xs text-slate-500 mt-0.5">Powered by FastSpring</p>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Engineering analytics for teams that ship. Built with Next.js, TypeScript, and FastSpring.
            </p>
          </div>

          <div>
            <h5 className="font-semibold text-white mb-4 text-sm">Product</h5>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#features" className="hover:text-cyan-400 transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-cyan-400 transition-colors">Pricing</a></li>
              <li><a href="#webhooks" className="hover:text-cyan-400 transition-colors">Webhooks</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-white mb-4 text-sm">Developers</h5>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="https://developer.fastspring.com" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">FastSpring Docs</a></li>
              <li><a href="/store" className="hover:text-cyan-400 transition-colors">Embedded Store</a></li>
              <li><a href="/api/events" className="hover:text-cyan-400 transition-colors">Events API</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-white mb-4 text-sm">Legal</h5>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Security</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} DevMetrics. Billing & tax compliance handled by FastSpring (Merchant of Record).
          </p>
          <p className="text-slate-600 text-xs">
            Built with Next.js · TypeScript · Tailwind · FastSpring SBL
          </p>
        </div>
      </div>
    </footer>
  );
}
