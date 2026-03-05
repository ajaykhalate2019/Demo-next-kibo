export const topHeaderStyles = {
  wrapper: {
    display: {
      xs: 'none',
      md: 'flex',
    },
    backgroundColor: 'common.white',
    justifyContent: 'flex-end',
    zIndex: (theme: any) => theme.zIndex.modal,
    paddingBlock: 0.5,
    paddingInline: 2,
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
    backgroundColor: '#f2f2f2ff',
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
    backgroundColor: 'common.white',
    minHeight: '50px',
  },
  appBarStyles: {
    zIndex: (theme: any) => theme.zIndex.modal,
    scrollBehavior: 'smooth',
    backgroundColor: 'common.white',
    boxShadow: 'none',
    borderBottomWidth: '1px ',
    borderBottomStyle: ' solid',
    borderBottomColor: 'grey.500',
  },
  logoStyles: {
    // cursor: 'pointer',
    textAlign: 'left',
    position: 'relative',
    margin: 0,
    // minHeight: '70px',
    // width: '100%',
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
