import React, { useState } from 'react';

import { postComment } from '../../apiClient/apiClient';

export interface AddCommentFormProps {
  slug: string;
}

export const AddCommentForm: React.FunctionComponent<AddCommentFormProps> = ({
  slug,
}) => {
  const [postError, setPostError] = useState<string>(null);
  const [postSuccess, setPostSuccess] = useState<boolean>(false);
  const [isPosting, setIsPosting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPostError(null);
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
          setPostError(e.message);
        }
      )
      .finally(() => {
        setIsPosting(false);
      });
  };

  return (
    <form action="" onSubmit={handleSubmit}>
      <input type="hidden" name="fields[slug]" value={slug} />
      <div>
        <label htmlFor="comment-name">Your name</label>
        <input
          id="comment-name"
          name="fields[name]"
          type="text"
          required
          disabled={isPosting}
        />
      </div>
      <div>
        <label htmlFor="comment-text">Your comment</label>
        <textarea
          id="comment-text"
          name="fields[message]"
          required
          rows={3}
          disabled={isPosting}
        />
      </div>
      {postError && (
        <div>There was an error saving your comment. Please try again.</div>
      )}
      {postSuccess && (
        <div>Your comment was successfully saved and is awaiting approval.</div>
      )}
      <button type="submit" disabled={isPosting}>
        Post Comment
      </button>
    </form>
  );
};
