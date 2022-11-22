/** @jsxImportSource @emotion/react */

export interface UserListTabProps {
  selected: number;
  setSelected: (value: number) => void;
}

const UserListTab = ({ selected }: UserListTabProps) => {
  return (
    <ul>
      <li>유저</li>
      <li>친구</li>
      <li>랭킹</li>
    </ul>
  );
};

export default UserListTab;
