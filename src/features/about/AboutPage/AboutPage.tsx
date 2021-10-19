import React from 'react';
import classNames from 'classnames/bind';
import { AxisOptions, Chart } from 'react-charts';
import { PageShell } from '../../layout/PageShell/PageShell';
import { Typography } from '../../layout/Typography/Typography';

import STYLES from './AboutPage.module.scss';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { MarkdownContent } from '../../blog/MarkdownContent/MarkdownContent';
import { AboutpageSeo } from '../../api/strapi';
const classes = classNames.bind(STYLES);

export type AboutPageProps = {
  mdxSource: MDXRemoteSerializeResult<Record<string, unknown>>;
  seo: AboutpageSeo;
};

type DailyStars = {
  primary: string;
  secondary: number;
};

type Series = {
  label: string;
  data: DailyStars[];
};

const data: {
  label: string;
  data: DailyStars[];
}[] = [
  {
    label: 'Experience Level',
    data: [
      { primary: 'Java', secondary: 70 },
      { primary: 'C#/.NET', secondary: 72 },
      { primary: 'Node.js', secondary: 85 },
      { primary: 'React', secondary: 94 },
      { primary: 'TypeScript', secondary: 94 },
      { primary: 'JavaScript', secondary: 95 },
    ],
  },
];

export const AboutPage: React.FC<AboutPageProps> = ({ mdxSource, seo }) => {
  const primaryAxis = React.useMemo(
    (): AxisOptions<DailyStars> => ({
      position: 'left',
      styles: {
        tick: {
          fontSize: 30,
          color: 'red',
        },
      },
      getValue: (datum) => datum.primary,
    }),
    []
  );

  const secondaryAxes = React.useMemo(
    (): AxisOptions<DailyStars>[] => [
      {
        position: 'bottom',
        getValue: (datum) => datum.secondary,
        stacked: true,
        styles: {
          tick: {
            fontSize: 30,
            color: 'red',
          },
        },
      },
    ],
    []
  );
  return (
    <PageShell title={seo.metaTitle} description={seo.metaDescription}>
      <Typography as="div" variant="prose" className={classes('content')}>
        <h1>{seo.metaTitle}</h1>
        <MarkdownContent mdxSource={mdxSource} />
        <div
          style={{
            height: '400px',
          }}>
          <Chart
            options={{
              data,
              primaryAxis,
              secondaryAxes,
              dark: true,
              tooltip: false,
              useIntersectionObserver: true,

              getDatumStyle(datum, status) {
                return {
                  rectangle: {
                    fill: '#569cd6',
                  },
                };
              },
            }}
          />
        </div>
      </Typography>
    </PageShell>
  );
};
