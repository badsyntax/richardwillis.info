import styles from './PostBody.module.css';

export interface PostBodyProps {
  content: string;
}

export const PostBody: React.FunctionComponent<PostBodyProps> = ({
  content,
}) => {
  return (
    <div>
      <div
        className={styles['markdown']}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};
