/*! Based off modern-normalize v1.1.0 | MIT License | https://github.com/sindresorhus/modern-normalize */

import { globalStyle } from '@vanilla-extract/css';

globalStyle('*, ::before,::after', {
  boxSizing: 'border-box',
});

/**
1. Correct the line height in all browsers.
2. Prevent adjustments of font size after orientation changes in iOS.
3. Use a more readable tab size (opinionated).
*/

globalStyle('html', {
  lineHeight: 1.15 /* 1 */,
  textSizeAdjust: '100%' /* 2 */,
  tabSize: '4' /* 3 */,
});

/*
Sections
========
*/

/**
1. Remove the margin in all browsers.
2. Improve consistency of default fonts in all browsers. (https://github.com/sindresorhus/modern-normalize/issues/3)
*/

globalStyle('body', {
  margin: 0 /* 1 */,
  fontFamily: `system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji'`,
});

/*
Grouping content
================
*/

/**
1. Add the correct height in Firefox.
2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
*/

globalStyle('hr', {
  height: 0 /* 1 */,
  color: 'inherit' /* 2 */,
});

/*
Text-level semantics
====================
*/

/**
Add the correct text decoration in Chrome, Edge, and Safari.
*/

globalStyle('abbr[title]', {
  textDecoration: 'underline dotted',
});

/**
Add the correct font weight in Edge and Safari.
*/

globalStyle('b, strong', {
  fontWeight: 'bolder',
});

/**
1. Improve consistency of default fonts in all browsers. (https://github.com/sindresorhus/modern-normalize/issues/3)
2. Correct the odd 'em' font sizing in all browsers.
*/

globalStyle('code,kbd,samp,pre', {
  fontFamily: `ui-monospace, SFMono-Regular, Consolas, 'Liberation Mono', Menlo,monospace`,
  fontSize: '1em',
});

/**
Add the correct font size in all browsers.
*/

globalStyle('small', {
  fontSize: '80%',
});

/**
Prevent 'sub' and 'sup' elements from affecting the line height in all browsers.
*/

globalStyle('sub,sup', {
  fontSize: '75%',
  lineHeight: 0,
  position: 'relative',
  verticalAlign: 'baseline',
});

globalStyle('sub', {
  bottom: '-0.25em',
});

globalStyle('sup', {
  top: '-0.5em',
});

/*
Tabular data
============
*/

/**
1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
*/

globalStyle('table', {
  textIndent: 0 /* 1 */,
  borderColor: 'inherit' /* 2 */,
});

/*
Forms
=====
*/

/**
1. Change the font styles in all browsers.
2. Remove the margin in Firefox and Safari.
*/

globalStyle('button, input, optgroup, select, textarea', {
  fontFamily: 'inherit' /* 1 */,
  fontSize: '100%' /* 1 */,
  lineHeight: '1.15' /* 1 */,
  margin: 0 /* 2 */,
});

/**
Remove the inheritance of text transform in Edge and Firefox.
*/

globalStyle('button, select', {
  textTransform: 'none',
});

/**
Correct the inability to style clickable types in iOS and Safari.
*/

globalStyle(`button, [type='button'], [type='reset'], [type='submit']`, {
  appearance: 'button',
});

/**
Remove the inner border and padding in Firefox.
*/

globalStyle('::-moz-focus-inner', {
  borderStyle: 'none',
  padding: 0,
});

/**
Restore the focus styles unset by the previous rule.
*/

globalStyle(':-moz-focusring', {
  outline: '1px dotted ButtonText',
});

/**
Remove the additional ':invalid' styles in Firefox.
See: https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737
*/

globalStyle(':-moz-ui-invalid', {
  boxShadow: 'none',
});

/**
Remove the padding so developers are not caught out when they zero out 'fieldset' elements in all browsers.
*/

globalStyle('legend', {
  padding: 0,
});

/**
Add the correct vertical alignment in Chrome and Firefox.
*/

globalStyle('progress', {
  verticalAlign: 'baseline',
});

/**
Correct the cursor style of increment and decrement buttons in Safari.
*/

globalStyle('::-webkit-inner-spin-button, ::-webkit-outer-spin-button', {
  height: 'auto',
});

/**
1. Correct the odd appearance in Chrome and Safari.
2. Correct the outline style in Safari.
*/

globalStyle(`[type='search']`, {
  appearance: 'textfield',
  outlineOffset: '-2px',
});

/**
Remove the inner padding in Chrome and Safari on macOS.
*/

globalStyle('::-webkit-search-decoration', {
  appearance: 'none',
});

/**
1. Correct the inability to style clickable types in iOS and Safari.
2. Change font properties to 'inherit' in Safari.
*/

globalStyle('::-webkit-file-upload-button', {
  appearance: 'button',
  font: 'inherit',
});

/*
Interactive
===========
*/

/*
Add the correct display in Chrome and Safari.
*/

globalStyle('summary', {
  display: 'list-item',
});
