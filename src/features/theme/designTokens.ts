export const fonts = {
  default:
    "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
};

export const fontSize = {
  sm: '0.6rem',
  base: '1rem',
  md: '1.05rem',
  lg: '1.4rem',
  xl: '1.8rem',
  xxl: '2.25rem',
  '2xl': '3.5rem',
  '3xl': '4.5rem',
};

export const colors = {
  background: '#1e1e1e',
  text: '#d4d4d4',
  link: '#569cd6',
  heading: '#ce9178',
  tags: '#73c991',
};

export const spacing = {
  xs: '4px',
  sm: '10px',
  md: '16px',
  lg: '26px',
  xl: '36px',
  xxl: '48px',
  '2xl': '58px',
};

export const breakpoints = {
  mobileL: '320px',
  tablet: '640px',
  laptop: '1024px',
  desktop: '1200px',
};

const minWidth = (width: string) => `(min-width: ${width})`;

export const device = {
  mobileL: minWidth(breakpoints.mobileL),
  tablet: minWidth(breakpoints.tablet),
  laptop: minWidth(breakpoints.laptop),
  desktop: minWidth(breakpoints.desktop),
};

export const shellWidth = '68rem';

export const borderWidth = 1;
export const contrastActiveBorder = '#f38518';
export const contrastBorder = '#6fc3df';
export const cornerRadius = 0;
export const designUnit = 4;
export const disabledOpacity = 0.4;
export const focusBorder = '#007fd4';
export const fontFamily =
  '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol';

export const fontWeight = 400;
export const foreground = '#cccccc';
export const inputHeight = 26;
export const inputMinWidth = '100px';
export const typeRampBaseFontSize = '13px';
export const typeRampBaseLineHeight = 'normal';
export const typeRampMinus1FontSize = '11px';
export const typeRampMinus1LineHeight = '16px';
export const typeRampMinus2FontSize = '9px';
export const typeRampMinus2LineHeight = '16px';
export const typeRampPlus1FontSize = '16px';
export const typeRampPlus1LineHeight = '24px';

/**
 * Badge design tokens.
 */

export const badgeBackground = '#4d4d4d';
export const badgeForeground = '#ffffff';

/**
 * Button design tokens.
 */

// Note: Button border is used only for high contrast themes and should be left as transparent otherwise.
export const buttonBorder = 'transparent';
export const buttonIconBackground = 'transparent';
export const buttonIconCornerRadius = '5px';
export const buttonIconFocusBorderOffset = 0;
export const buttonIconHoverBackground = 'rgba(90, 93, 94, 0.31)';
export const buttonIconPadding = '3px';
export const buttonPrimaryBackground = '#0e639c';
export const buttonPrimaryForeground = '#ffffff';
export const buttonPrimaryHoverBackground = '#1177bb';
export const buttonSecondaryBackground = '#3a3d41';
export const buttonSecondaryForeground = '#ffffff';
export const buttonSecondaryHoverBackground = '#45494e';
export const buttonPaddingHorizontal = '11px';
export const buttonPaddingVertical = '6px';

/**
 * Checkbox design tokens.
 */

export const checkboxBackground = '#3c3c3c';
export const checkboxBorder = '#3c3c3c';
export const checkboxCornerRadius = 3;
export const checkboxForeground = '#f0f0f0';

/**
 * Data Grid design tokens
 */

export const listActiveSelectionBackground = '#094771';
export const listActiveSelectionForeground = '#ffffff';
export const listHoverBackground = '#2a2d2e';
export const quickInputBackground = '#252526';

/**
 * Divider design tokens.
 */

export const dividerBackground = '#454545';

/**
 * Dropdown design tokens.
 */

export const dropdownBackground = '#3c3c3c';
export const dropdownBorder = '#3c3c3c';
export const dropdownForeground = '#f0f0f0';
export const dropdownListMaxHeight = '200px';

/**
 * Text Field & Area design tokens.
 */

export const inputBackground = '#3c3c3c';
export const inputForeground = '#cccccc';
export const inputPlaceholderForeground = '#cccccc';

/**
 * Link design tokens.
 */

export const linkActiveForeground = '#3794ff';
export const linkForeground = '#3794ff';

/**
 * Progress ring design tokens.
 */

export const progressBackground = '#0e70c0';

/**
 * Panels design tokens.
 */

export const panelTabActiveBorder = '#e7e7e7';
export const panelTabActiveForeground = '#e7e7e7';
export const panelTabForeground = '#e7e7e799';
export const panelViewBackground = '#1e1e1e';
export const panelViewBorder = '#80808059';

/**
 * Tag design tokens.
 */

export const tagCornerRadius = '2px';
