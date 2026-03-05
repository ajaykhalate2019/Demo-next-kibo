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
    <footer className="w-full mt-20 bg-[#1A1A1A] text-white">

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-10">

          {/* NEWSLETTER */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold mb-4 tracking-wide">
              JOIN OUR NEWSLETTER
            </h3>

            <p className="text-gray-400 text-sm mb-8 max-w-sm leading-relaxed">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>

            {/* INPUT */}
            <div className="flex w-full max-w-md bg-[#1e293b] border border-gray-700 rounded-lg overflow-hidden shadow-md">

              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder-gray-400 outline-none"
              />

              <button className="bg-teal-500 hover:bg-teal-600 px-6 text-sm font-medium transition">
                Subscribe
              </button>

            </div>

            <p className="text-xs text-gray-500 mt-4">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>

          {/* FOOTER SECTIONS */}
          {sections.map((section: any) => (
            <div key={section.title} className="col-span-1">
              <h4 className="text-[#2ea195] uppercase tracking-widest text-xs font-semibold mb-6">
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

        {/* DIVIDER */}
        <div className="border-t border-gray-600 mt-16 pt-8" />

        {/* BOTTOM BAR */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-400">

          {/* LEFT LINKS */}
          <div className="flex items-center gap-8 text-sm">

            <span className="cursor-pointer hover:text-white transition">
              Terms of Use
            </span>

            <span className="cursor-pointer hover:text-white transition">
              Privacy Policy
            </span>

            <span className="cursor-pointer hover:text-white transition">
              Accessibility
            </span>

            <span className="cursor-pointer hover:text-white transition">
              Site Map
            </span>

          </div>

          {/* SOCIAL ICONS */}
          <div className="flex items-center gap-5">
            {social.map((item: any, index: number) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black hover:bg-teal-500 transition"
              >
                <img
                  src={item.iconPath}
                  alt="social"
                  className="h-3.5 w-3.5"
                />
              </a>
            ))}
          </div>

          {/* COPYRIGHT */}
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Fashion Cloth. All rights reserved.
          </p>

        </div>

      </div>
    </footer>
  )
}