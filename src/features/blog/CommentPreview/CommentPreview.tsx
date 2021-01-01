import React from React;

export const CommentPreview = () => {
  return (
    <CommentBox author="test" date={new Date()} className={classes('preview')}>
      <MarkdownContent content={preview} />
    </CommentBox>
  );
};
