import type { Theme } from '@emotion/react';

export declare type ThemedStyles<Props = unknown> = (
  props: Props & {
    theme: Theme;
  }
) => any;
