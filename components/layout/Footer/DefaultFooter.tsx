const FooterItemLink = ({ link, text }: any) => {
  return (
    <div>
      <a
        href={link}
        className="group relative text-sm text-white hover:text-teal-400 transition duration-300"
      >
        {text}

        {/* underline animation */}
        <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
      </a>
    </div>
  )
}

export default function DefaultFooter({ sections = [], social = [] }: any) {
  return (
    <footer className="relative w-full mt-10 bg-gradient-to-r from-[#6dd5ed] via-[#2ea195] to-[#2193b0] backdrop-blur-md text-white overflow-hidden shadow-2xl">
     
      {/* <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_50%,white,transparent_40%)] animate-pulse"></div> */}

      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-white/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative max-w-screen-2xl mx-auto py-10 sm:py-12 md:py-16 px-4 sm:px-6">
        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-12 lg:gap-16">
          {/* NEWSLETTER */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-6 tracking-tight bg-gradient-to-r from-black to-gray-400 bg-clip-text text-transparent">
              JOIN OUR NEWSLETTER
            </h3>

            <p className="text-gray-800 text-sm mb-10 max-w-sm leading-relaxed font-medium">
              Join our community to receive curated offers, style inspiration, and exclusive early access to our latest collections.
            </p>

            {/* INPUT SECTION with GLASSMORPHISM */}
            <div className="group relative flex w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 hover:bg-white/20 hover:shadow-cyan-500/20 focus-within:bg-white/30 focus-within:ring-2 focus-within:ring-cyan-400/50 focus-within:scale-[1.01]">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-transparent px-5 py-4 text-sm text-white placeholder:text-white/50 outline-none w-full"
              />
              <button className="bg-gradient-to-r from-[#2ea195] to-[#2193b0] hover:from-[#3fb3a6] hover:to-[#2da5c3] px-8 text-sm font-bold tracking-wide transition-all duration-300 shadow-lg hover:shadow-cyan-500/20 active:scale-95">
                Subscribe
              </button>
            </div>
          </div>

          {/* FOOTER SECTIONS */}
          <div className="md:col-span-4 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {sections.map((section: any) => (
              <div key={section.title} className="col-span-1">
                <h4 className="text-[#1A1A1A] uppercase tracking-[0.2em] text-[12px] font-black mb-8">
                  {section.title}
                </h4>

                <div className="space-y-3">
                  {section.items.map((item: any) => (
                    <FooterItemLink key={item.text} {...item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DIVIDER */}
        <div className="mt-10 pt-8 border-t border-black/10 flex flex-col items-center"></div>

        {/* BOTTOM BAR */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-sm">
          {/* LEFT LINKS */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-gray-700 font-medium">
            <span className="cursor-pointer hover:text-white hover:scale-105 transition-all duration-300">Terms of Use</span>
            <span className="cursor-pointer hover:text-white hover:scale-105 transition-all duration-300">Privacy Policy</span>
            <span className="cursor-pointer hover:text-white hover:scale-105 transition-all duration-300">Accessibility</span>
            <span className="cursor-pointer hover:text-white hover:scale-105 transition-all duration-300">Site Map</span>
          </div>

          {/* SOCIAL ICONS */}
          <div className="flex items-center gap-6">
            {social.map((item: any, index: number) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-cyan-400/50 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-[#2ea195] to-[#2193b0] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img
                  src={item.iconPath}
                  alt="social"
                  className="relative h-6 w-6 transition-all duration-300 group-hover:scale-110 group-hover:brightness-200"
                />
              </a>
            ))}
          </div>

          {/* COPYRIGHT */}
          <p className="text-gray-700 font-medium tracking-tight">
            © {new Date().getFullYear()} <span className="text-gray-300">Fashion Cloth</span>.
          </p>
        </div>
      </div>
    </footer>
  )
}