import { style } from '@vanilla-extract/css';
import { themeStyle } from '../../../styles/theme.css';

export const card = style([
  themeStyle({
    padding: 'md',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginY: 'lg',
  }),
  {
    borderColor: '#333', //FIXME
    borderWidth: '1px',
    borderRadius: '10px',
    borderStyle: 'solid',
    textDecoration: 'none',
    transitionDuration: '0.4s',
    transitionProperty: 'box-shadow, border-color',
    selectors: {
      '&:hover': {
        // borderColor: $theme-heading-color; // FIXME
      },
      //   & :last-child {
      //     margin-bottom: 0;
      //   }
    },
  },
]);

export const title = style([
  themeStyle({
    marginBottom: {
      mobile: 'md',
      desktop: 'md',
    },
    color: 'link',
    fontSize: 'lg',
  }),
  {
    marginTop: 0,
    selectors: {
      // [`${card} &`]: {
      //   color: 'red',
      // },
    },
  },
]);

export const content = themeStyle({
  marginBottom: 'md',
});

// ${parentClass}
