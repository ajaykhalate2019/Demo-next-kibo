export const topHeaderStyles = {
  wrapper: {
    display: {
      xs: 'none',
      md: 'flex',
    },
    backgroundColor: '#1A1A1A',
    justifyContent: 'flex-end',
    zIndex: (theme: any) => theme.zIndex.modal,
    paddingBlock: 0.5,
    paddingInline: 4,
    borderBottom: '1px solid #222222',
  },
  container: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
}

export const headerActionAreaStyles = {
  wrapper: {
    display: 'flex',
    backgroundColor: '#6dd9ccff',
    paddingBlock: { xs: 0, md: 0.5 },
  },
  container: {
    display: 'flex',
    justifyContent: 'end',
    alignItems: 'center',
  },
  searchSuggestionsWrapper: {
    maxWidth: '100%',
    flex: 'unset',
    display: { xs: 'none', md: 'flex' },
    alignItems: 'center',
    // height: '100%',
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 1,
  },
  logoWrapper: {
    order: 0,
    // top: '-27px',
  },
}

export const kiboHeaderStyles = {
  topBarStyles: {
    zIndex: (theme: any) => theme.zIndex.modal,
    width: '100%',
    backgroundColor: '#c4c7c7ff',
    minHeight: '45px',
  },
  appBarStyles: {
    zIndex: (theme: any) => theme.zIndex.modal,
    scrollBehavior: 'smooth',
    backgroundColor: 'transparent',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
    borderBottomWidth: '1px ',
    borderBottomStyle: ' solid',
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  logoStyles: {
    cursor: 'pointer',
    textAlign: 'left',
    position: 'relative',
    margin: 0,
    minHeight: '60px',
    width: 'auto',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: '0 0 auto',
    backgroundColor: 'transparent',
    display: {
      xs: 'none',
      md: 'flex',
    },
    background: 'transparent',
  },
  megaMenuStyles: {
    margin: 'auto',
    color: 'common.black',
    width: '100%',
    minHeight: '40px',
    backgroundColor: 'common.white',
    display: {
      xs: 'none',
      md: 'block',
    },
  },
}
