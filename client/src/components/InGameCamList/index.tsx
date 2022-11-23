/** @jsxImportSource @emotion/react */
import Cam, { CamProps } from "../Cam";
import * as style from "./styles";
import { css } from "@emotion/react";

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
      {camList.map((cam, index) => (
        <div key={index} css={style.camWrapperStyle}>
          <Cam {...cam} />
        </div>
      ))}
    </div>
  );
};

export default InGameCamList;
