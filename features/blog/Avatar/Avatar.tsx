export interface AvatarProps {
  name: string;
  picture: string;
}

export const Avatar: React.FunctionComponent<AvatarProps> = ({
  name,
  picture,
}) => {
  return (
    <div>
      <img src={picture} alt={name} />
      <div>{name}</div>
    </div>
  );
};
