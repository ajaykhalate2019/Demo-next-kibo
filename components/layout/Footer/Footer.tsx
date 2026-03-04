import { Grid, Typography, Box, Link } from '@mui/material'
import { useTranslation } from 'next-i18next'

import { KiboImage } from '@/components/common'

const FooterItemLink = (props: any) => {
  return (
    <Typography variant="body2" sx={{ mb: 1 }}>
      <Link
        href={props.link}
        underline="none"
        // color="common.black"
        sx={{ color: '#333', '&:hover': { textDecoration: 'underline' } }}
      >
        {props.text}
      </Link>
    </Typography>
  )
}
export default function Footer(props: any) {
  const { sections = [], social = [] } = props
  const { t } = useTranslation('common')
  const mdColumnWidth = 12 / sections.length
  return (
    <Box
      component="div"
      sx={{
        p: 10,
        // padding: '60px 80px',
        marginTop: 10,
        // borderTop: '.5rem solid',
        // borderColor: 'primary.main',
        backgroundColor: '#f2f2f2',

        // width: '100%',
        // flexShrink: 0,
      }}
    >
      {/* Footer Links */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ color: 'primary.main' }}>
        {sections.map((footerSection: any) => {
          return (
            <Grid
              key={footerSection.title}
              item
              xs={12}
              md={mdColumnWidth}
              alignContent="center"
              justifyContent="space-around"
              // textAlign="justify"
              pr={5}
            >
              <Typography
                variant="subtitle2"
                sx={{ textTransform: 'uppercase', fontWeight: '600', mb: 2 }}
              >
                {footerSection.title}
              </Typography>

              {footerSection.items.map((footerItem: any) => (
                <FooterItemLink key={footerItem.text} {...footerItem} />
              ))}
            </Grid>
          )
        })}

        <Grid item xs={12} md={mdColumnWidth} alignContent="center" textAlign="center"></Grid>
      </Grid>

      {/* <Grid container spacing={{ xs: 2, md: 3 }} sx={{ color: 'common.black', paddingTop: 5 }}>
        <Grid item xs={12} md={mdColumnWidth} alignContent="center" textAlign="center">
          <Typography
            variant="subtitle2"
            sx={{ textTransform: 'uppercase', fontWeight: '600', marginBottom: 1 }}
          >
            {t('')}
          </Typography> */}

      <Box
        sx={{
          borderTop: '1px solid #ddd',
          marginTop: 5,
          paddingTop: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          fontSize: '13px',
          color: 'primary.main',
        }}
      >
        <Box>Terms of Use &nbsp; Privacy Policy &nbsp; Accessibility &nbsp; Site Map</Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {social.map((item: any, index: number) => (
            <Link key={index} href={item.link} target="_blank">
              {/* component="span" */}
              <Box
                component="img"
                src={item.iconPath}
                alt="social-icon"
                sx={{
                  width: 30,
                  height: 30,
                  cursor: 'pointer',
                }}
              />
              {/* <KiboImage src={socialItem.iconPath} alt={'content tiles'} width={32} height={32} /> */}
            </Link>
          ))}
        </Box>
        <Typography>© {new Date().getFullYear()} Fashion Cloth.</Typography>
        {/* </Grid>
      </Grid> */}
      </Box>
    </Box>
  )
}
