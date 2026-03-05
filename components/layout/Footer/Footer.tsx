import { Grid, Typography, Box, Link, TextField, Button, Container, Divider, Stack } from '@mui/material'
import { useTranslation } from 'next-i18next'
import InstagramIcon from '@mui/icons-material/Instagram'
import FacebookIcon from '@mui/icons-material/Facebook'
import TwitterIcon from '@mui/icons-material/Twitter'
import YouTubeIcon from '@mui/icons-material/YouTube'

import { KiboImage } from '@/components/common'

const FooterItemLink = (props: any) => {
  return (
    <Typography variant="body2" sx={{ mb: 1.5 }}>
      <Link
        href={props.link}
        underline="none"
        sx={{
          color: 'grey.500',
          transition: 'all 0.2s',
          '&:hover': { color: 'common.white', pl: 0.5 },
        }}
      >
        {props.text}
      </Link>
    </Typography>
  )
}
export default function Footer(props: any) {
  const { sections = [], social = [] } = props
  const { t } = useTranslation('common')
  const totalSections = sections.length
  // Newsletter takes approx 1/3, rest is divided among sections
  const newsletterWidth = 4
  const sectionWidth = (12 - newsletterWidth) / totalSections
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#1A1A1A',
        color: 'common.white',
        pt: 8,
        pb: 4,
        mt: 10,
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Newsletter Section */}
          <Grid item xs={12} md={newsletterWidth}>
            <Typography variant="h6" fontWeight={650} gutterBottom sx={{ color: 'common.white' }}>
              JOIN OUR NEWSLETTER
            </Typography>
            <Typography variant="body2" sx={{ color: 'grey.500', mb: 3 }}>
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </Typography>
            <Stack direction="row" spacing={1}>
              <TextField
                placeholder="Enter your email"
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                  bgcolor: 'grey.900',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    color: 'common.white',
                    '& fieldset': { borderColor: 'grey.800' },
                    '&:hover fieldset': { borderColor: 'grey.700' },
                    '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'grey.600',
                    opacity: 1,
                  },
                }}
              />
              <Button
                variant="contained"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'common.white',
                  px: 3,
                  '&:hover': { bgcolor: 'primary.dark' },
                  whiteSpace: 'nowrap',
                }}
              >
                Subscribe
              </Button>
            </Stack>
          </Grid>

          {/* Dynamic Sections */}
          {sections.map((footerSection: any) => (
            <Grid key={footerSection.title} item xs={6} sm={4} md={sectionWidth}>
              <Typography
                variant="subtitle2"
                sx={{
                  textTransform: 'uppercase',
                  fontWeight: '700',
                  mb: 3,
                  letterSpacing: 1.5,
                  color: 'primary.main',
                }}
              >
                {footerSection.title}
              </Typography>

              {footerSection.items.map((footerItem: any) => (
                <FooterItemLink key={footerItem.text} {...footerItem} />
              ))}
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ mt: 8, mb: 4, borderColor: 'grey.900' }} />

        {/* Bottom Bar */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
          }}
        >
          <Stack
            direction="row"
            spacing={3}
            sx={{
              color: 'grey.500',
              fontSize: '13px',
              '& a': { color: 'inherit', textDecoration: 'none', '&:hover': { color: 'white' } },
            }}
          >
            <Link href="#">Terms of Use</Link>
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Accessibility</Link>
            <Link href="#">Site Map</Link>
          </Stack>

          <Stack direction="row" spacing={2.5}>
            {social.map((item: any, index: number) => (
              <Link
                key={index}
                href={item.link}
                target="_blank"
                sx={{
                  color: 'grey.400',
                  transition: '0.3s',
                  '&:hover': { color: 'primary.main', transform: 'scale(1.2)' },
                }}
              >
                <Box
                  component="img"
                  src={item.iconPath}
                  alt="social-icon"
                  sx={{ width: 20, height: 20, filter: 'invert(1)' }}
                />
              </Link>
            ))}
          </Stack>

          <Typography variant="caption" sx={{ color: 'grey.600' }}>
            © {new Date().getFullYear()} Fashion Cloth. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
