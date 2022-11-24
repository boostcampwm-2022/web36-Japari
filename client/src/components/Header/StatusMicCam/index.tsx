/** @jsxImportSource @emotion/react */
import micOn from "../../../assets/icons/mic-on.svg";
import micOff from "../../../assets/icons/mic-off.svg";
import camOn from "../../../assets/icons/cam-on.svg";
import camOff from "../../../assets/icons/cam-off.svg";

import * as style from "./styles";

export interface StatusMicCamProps {
  micStatus: boolean;
  camStatus: boolean;
}

const StatusMicCam = ({ micStatus, camStatus }: StatusMicCamProps) => {
  return (
    <div css={style.micCamContainerStyle}>
      <div css={style.micCamButtonStyle}>
        {micStatus ? <img src={micOn} alt="micOn" /> : <img src={micOff} alt="micOff" />}
      </div>
      <div css={style.micCamButtonStyle}>
        {camStatus ? <img src={camOn} alt="camOn" /> : <img src={camOff} alt="camOff" />}
      </div>
    </div>
  );
};

export default StatusMicCam;
