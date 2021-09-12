import React, { useEffect, useRef, useState } from 'react';
// import classNames from 'classnames/bind';

import { Typography } from '../../layout/Typography/Typography';
import { FormRow } from '../../layout/FormRow/FormRow';
import { Label } from '../../layout/Label/Label';
import { Input } from '../../layout/Field/Input';
import { Alert, AlertSeverity } from '../../layout/Alert/Alert';
import { Button } from '../../layout/Button/Button';
import { Textarea } from '../../layout/Field/Textarea';

// import STYLES from './AddCommentForm.module.scss';
// const classes = classNames.bind(STYLES);

async function makeRequest(
  url: string,
  fetchOpts: RequestInit
): Promise<Response> {
  const response = await fetch(url, fetchOpts);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response;
}

function postComment(
  articleId: string,
  comment: FormData
): Promise<Response | void> {
  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve(undefined);
  //   }, 2000);
  // });
  // const url = `https://strapi.docker-box.richardwillis.info/articles/${articleId}/comment`;

  const url = 'http://localhost:1337/articles/22/comment';
  // @ts-ignore
  const searchParams = new URLSearchParams(comment);
  return makeRequest(url, {
    body: searchParams,
    method: 'POST',
    keepalive: true,
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  });
}

export interface AddCommentFormProps {
  articleId: string;
}

export const AddCommentForm: React.FunctionComponent<AddCommentFormProps> = ({
  articleId,
}) => {
  const formEl = useRef<HTMLFormElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [postSuccess, setPostSuccess] = useState<boolean>(false);
  const [isPosting, setIsPosting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsPosting(true);
    setPostSuccess(false);
    const formData = new FormData(e.target as HTMLFormElement);
    postComment(articleId, formData)
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

  useEffect(() => {
    if (postSuccess) {
      formEl?.current?.reset();
    }
  }, [postSuccess]);

  return (
    <form action="" onSubmit={handleSubmit} ref={formEl}>
      <FormRow>
        <Typography as="h3">Add a new comment</Typography>
      </FormRow>
      <FormRow>
        <Label htmlFor="comment-author" hidden>
          Your name
        </Label>
        <Input
          id="comment-author"
          type="text"
          placeholder="Name"
          required
          name="author"
          disabled={isPosting}
        />
      </FormRow>
      <FormRow>
        <Label htmlFor="comment-body" hidden>
          Your comment
        </Label>
        <Textarea
          id="comment-body"
          name="body"
          placeholder="Comment"
          required
          rows={4}
          disabled={isPosting}
          fullWidth></Textarea>
      </FormRow>
      {error && (
        <Alert severity={AlertSeverity.error}>
          There was an error saving your comment. Please try again.
        </Alert>
      )}
      {postSuccess && (
        <Alert severity={AlertSeverity.success}>
          Your comment was successfully saved and is awaiting approval.
        </Alert>
      )}
      <FormRow>
        {/* <div className={classes('info-container')}>
          <InfoIcon className={classes('info-icon')} />
          <Typography as="span" className={classes('info-message')}>
            Markdown supported
          </Typography>
        </div> */}
        <div>
          {/* {!preview && (
            <Button
              type="button"
              className={classes('button', !message && 'button-hidden')}
              onClick={handlePreviewButtonClick}
              isLoading={isPreviewLoading}
              disabled={isPosting}>
              Preview
            </Button>
          )}
          {!!preview && (
            <Button
              type="button"
              className={classes('button', !message && 'button-hidden')}
              onClick={handleEditButtonClick}
              disabled={isPosting}>
              Edit
            </Button>
          )} */}
          <Button isLoading={isPosting} type="submit" disabled={isPosting}>
            Post Comment
          </Button>
        </div>
      </FormRow>
    </form>
  );
};
