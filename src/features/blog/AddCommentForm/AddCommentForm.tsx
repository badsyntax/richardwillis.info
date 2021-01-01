import React, { lazy, useState } from 'react';
import classNames from 'classnames/bind';

import { Button } from '../../layout/Button/Button';
import { Typography } from '../../layout/Typography/Typography';

import { MarkdownContent } from '../MarkdownContent/MarkdownContent';
import { CommentBox } from '../../layout/CommentBox/CommentBox';
import STYLES from './AddCommentForm.module.css';
const classes = classNames.bind(STYLES);

export const AddCommentForm: React.FunctionComponent = () => {
  const [message, setMessage] = useState<string>('');
  const [preview, setPreview] = useState<string>(null);

  const [isPreviewLoading, setIsPreviewLoading] = useState<boolean>(false);
  const [hasPreviewLoaded, setHasPreviewLoaded] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('form submit');
  };

  const handleMessageChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    setMessage((e.target as HTMLTextAreaElement).value);
  };

  const handlePreviewButtonClick = async () => {
    setIsPreviewLoading(true);
    import('../../markdown/markdownToSimpleHtml')
      .then(({ markdownToSimpleHtml }) => {
        const html = markdownToSimpleHtml(message);
        setPreview(html);
      })
      .finally(() => {
        setIsPreviewLoading(false);
      });
  };

  const handleEditButtonClick = () => {
    setPreview(null);
  };

  return (
    <form className={classes('form')} action="" onSubmit={handleSubmit}>
      <label className={classes('heading')} htmlFor="comment-text">
        Add a new comment
      </label>
      <div className={classes('textarea-container')}>
        {!!preview && (
          <CommentBox
            showHeader={false}
            className={classes('preview')}
            message={preview}
          />
        )}
        <textarea
          id="comment-text"
          className={classes('textarea', !!preview && 'sr-hidden')}
          name="message"
          placeholder="Type Your Comment"
          required
          value={message}
          onChange={handleMessageChange}
        ></textarea>
      </div>
      <div className={classes('submit-container')}>
        <div className={classes('info-container')}>
          <svg
            fill="none"
            className={classes('info-icon')}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <Typography as="span" className={classes('info-message')}>
            Markdown supported
          </Typography>
        </div>
        <div className={classes('footer')}>
          {!preview && (
            <Button
              type="button"
              className={classes('button', !message && 'button-hidden')}
              onClick={handlePreviewButtonClick}
            >
              Preview
              {isPreviewLoading && 'loading'}
            </Button>
          )}
          {!!preview && (
            <Button
              type="button"
              className={classes('button', !message && 'button-hidden')}
              onClick={handleEditButtonClick}
            >
              Edit
            </Button>
          )}
          <Button
            type="submit"
            className={classes('button')}
            disabled={!message}
          >
            Post Comment
          </Button>
        </div>
      </div>
    </form>
  );
};
