import React from 'react';
import classNames from 'classnames/bind';

import { PageShell } from '../../layout/PageShell/PageShell';

import { Link } from '../../layout/Link/Link';
import { Typography } from '../../layout/Typography/Typography';
import { ImageGallery } from '../../layout/ImageGallery/ImageGallery';
import { photos } from './photos';

import STYLES from './AboutPage.module.css';
const classes = classNames.bind(STYLES);

export const AboutPage: React.FunctionComponent = () => {
  return (
    <PageShell title="About" description="About Richard Willis">
      <Typography as="div" variant="prose" className={classes('content')}>
        <h1>About</h1>
        <p>
          Hello there{' '}
          <span role="img" aria-label="wave">
            👋
          </span>
          . I'm a front-end leaning full-stack developer with more than 10 years
          of professional web development experience. I enjoy coding as a day
          job and as a hobby (check out my{' '}
          <Link href="/projects">open-source projects</Link>). I also find
          programming to be rather frustrating at times but it's really
          satisfying building something that's useful and works well and I guess
          I like to chase that feeling. When not coding I enjoy being outdoors
          and love hiking and cycling. Sometimes I do a bit of indoor bouldering
          too.
        </p>
        <p>
          I grew up in South Africa before moving to London for a few years, and
          then to Barcelona for a few years. Recently I moved back to the UK, to
          beautiful rural North Yorkshire, which is where I'm currently based.
        </p>
        {/* <h2>Professional Experience</h2>
        <p>
          I'm a front-end leaning full-stack developer with more than 10 years
          of professional web development experience. View my cv here:{' '}
          <a href="/cv">richardwillis.info/cv</a>
        </p> */}
        <h2>Photos</h2>
        <p>
          I don't consider myself a very good photographer but I do really enjoy
          nature and being outdoors. Most of the photos below were taken on a
          mobile device.
        </p>
      </Typography>
      <ImageGallery images={photos} width={400} height={300} />
    </PageShell>
  );
};
