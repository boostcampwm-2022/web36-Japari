/** @jsxImportSource @emotion/react */
import Cam, { CamProps } from "../Cam";
import * as style from "./styles";

export interface InGameCamListProps {
  camList: CamProps[];
}

export interface ProfileProps {
  profile: string;
}

const InGameCamList = ({ camList }: InGameCamListProps) => {
  // [camList, setCamList] = useState<Cam[]>([]);

  return (
    <div css={style.inGameCamListStyle}>
      {camList.map(cam => (
        <div css={style.camItemStyle}>
          <div css={style.camWrapperStyle}>
            <Cam {...cam} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default InGameCamList;
