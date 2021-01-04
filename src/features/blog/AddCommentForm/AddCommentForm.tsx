import React, { useState } from 'react';
import classNames from 'classnames/bind';

import { Button } from '../../layout/Button/Button';
import { Typography } from '../../layout/Typography/Typography';
import { PreviewCommentBox } from '../../layout/CommentBox/CommentBox';
import { FormRow } from '../../layout/FormRow/FormRow';
import { Textarea } from '../../layout/Field/Textarea';
import { Label } from '../../layout/Label/Label';
import { Input } from '../../layout/Field/Input';
import { postComment } from '../../apiClient/apiClient';
import { Alert, AlertSeverity } from '../../layout/Alert/Alert';

import STYLES from './AddCommentForm.module.css';
import { InfoIcon } from '../../layout/Icons/InfoIcon';
const classes = classNames.bind(STYLES);

export interface AddCommentFormProps {
  slug: string;
}

export const AddCommentForm: React.FunctionComponent<AddCommentFormProps> = ({
  slug,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [postSuccess, setPostSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [preview, setPreview] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsPosting(true);
    setPostSuccess(false);
    const formData = new FormData(e.target as HTMLFormElement);
    postComment(formData)
      .then(
        () => {
          setPostSuccess(true);
        },
        (e) => {
          setPostSuccess(false);
          setError(e.message);
        }
      )
      .finally(() => {
        setIsPosting(false);
      });
  };

  const handleMessageChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    setMessage((e.target as HTMLTextAreaElement).value);
  };

  const handlePreviewButtonClick = async () => {
    setError(null);
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
    setError(null);
    setPreview(null);
  };

  return (
    <form className={classes('form')} action="" onSubmit={handleSubmit}>
      <input type="hidden" name="fields[slug]" value={slug} />
      <FormRow>
        <Typography as="h3" className={classes('heading')}>
          Add a new comment
        </Typography>
      </FormRow>
      <FormRow>
        <Label htmlFor="comment-name" hidden>
          Your name
        </Label>
        <Input
          id="comment-name"
          type="text"
          className={classes('name-field')}
          placeholder="Name"
          required
          name="fields[name]"
          disabled={isPosting}
        />
      </FormRow>
      <FormRow>
        <Label htmlFor="comment-text" hidden>
          Your comment
        </Label>
        <Textarea
          id="comment-text"
          className={classes(!!preview && 'sr-hidden')}
          name="fields[message]"
          placeholder="Comment"
          required
          value={message}
          onChange={handleMessageChange}
          rows={3}
          disabled={isPosting}
          fullWidth
        ></Textarea>
        {!!preview && (
          <PreviewCommentBox className={classes('preview')} message={preview} />
        )}
      </FormRow>
      {error && (
        <Alert severity={AlertSeverity.error} className={classes('alert')}>
          There was an error saving your comment. Please try again.
        </Alert>
      )}
      {postSuccess && (
        <Alert severity={AlertSeverity.success} className={classes('alert')}>
          Your comment was successfully saved and is awaiting approval.
        </Alert>
      )}
      <FormRow className={classes('footer')}>
        <div className={classes('info-container')}>
          <InfoIcon className={classes('info-icon')} />
          <Typography as="span" className={classes('info-message')}>
            Markdown supported
          </Typography>
        </div>
        <div className={classes('buttons-container')}>
          {!preview && (
            <Button
              type="button"
              className={classes('button', !message && 'button-hidden')}
              onClick={handlePreviewButtonClick}
              isLoading={isPreviewLoading}
              disabled={isPosting}
            >
              Preview
            </Button>
          )}
          {!!preview && (
            <Button
              type="button"
              className={classes('button', !message && 'button-hidden')}
              onClick={handleEditButtonClick}
              disabled={isPosting}
            >
              Edit
            </Button>
          )}
          <Button
            isLoading={isPosting}
            type="submit"
            className={classes('button')}
            disabled={isPosting}
          >
            Post Comment
          </Button>
        </div>
      </FormRow>
    </form>
  );
};
