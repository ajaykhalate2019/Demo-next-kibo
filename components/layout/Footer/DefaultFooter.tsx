import { Grid, Typography, Box, Link } from '@mui/material'

const FooterItemLink = ({ link, text }: any) => {
  return (
    <Typography className="mb-2">
      <Link
        href={link}
        underline="none"
        className="text-sm text-gray-600 hover:text-black transition-colors duration-200"
      >
        {text}
      </Link>
    </Typography>
  )
}

export default function DefaultFooter({ sections = [], social = [] }: any) {
  return (
    <Box className="w-full bg-gray-100 mt-20">
      <Box className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        {/* Top Grid Section */}
        <Grid container spacing={8} justifyContent="space-around">
          {sections.map((section: any) => (
            <Grid item xs={12} sm={6} md={3} key={section.title}>
              <Typography className="text-sm font-semibold uppercase tracking-wide text-gray-900 mb-5">
                {section.title}
              </Typography>

              {section.items.map((item: any) => (
                <FooterItemLink key={item.text} {...item} />
              ))}
            </Grid>
          ))}
        </Grid>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-14 pt-8" />

        {/* Bottom Section */}
        <Box className="flex flex-row items-center justify-around gap-6 text-sm text-gray-600">
          {/* Left - Policies */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <span className="hover:text-black cursor-pointer">Terms of Use</span>
            <span className="hover:text-black cursor-pointer">Privacy Policy</span>
            <span className="hover:text-black cursor-pointer">Accessibility</span>
            <span className="hover:text-black cursor-pointer">Site Map</span>
          </div>

          {/* Center - Social Icons */}
          <div className="flex items-center gap-5">
            {social.map((item: any, index: number) => (
              <Link
                key={index}
                href={item.link}
                target="_blank"
                className="transition-transform duration-300 hover:scale-110"
              >
                <img
                  src={item.iconPath}
                  alt="social-icon"
                  className="w-5 h-5 opacity-70 hover:opacity-100 transition"
                />
              </Link>
            ))}
          </div>

          {/* Right - Copyright */}
          <Typography className="text-center md:text-right">
            © {new Date().getFullYear()} Fashion Cloth
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
