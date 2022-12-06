/** @jsxImportSource @emotion/react */
import micOn from "../../../assets/icons/mic-on.svg";
import micOff from "../../../assets/icons/mic-off.svg";
import camOn from "../../../assets/icons/cam-on.svg";
import camOff from "../../../assets/icons/cam-off.svg";
import * as style from "./styles";
import { useRecoilState, useRecoilValue } from "recoil";
import { audioState, videoState, streamState } from "./../../../store/media";

const StatusMedia = () => {
  const stream = useRecoilValue(streamState);
  const [audio, setAudio] = useRecoilState(audioState);
  const [video, setVideo] = useRecoilState(videoState);

  return (
    stream && (
      <div css={style.micCamContainerStyle}>
        <div
          css={style.micCamButtonStyle}
          onClick={() => {
            setAudio(!audio);
            stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
          }}
        >
          {audio ? <img src={micOn} alt="micOn" /> : <img src={micOff} alt="micOff" />}
        </div>
        <div
          css={style.micCamButtonStyle}
          onClick={() => {
            setVideo(!video);
            stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
          }}
        >
          {video ? <img src={camOn} alt="camOn" /> : <img src={camOff} alt="camOff" />}
        </div>
      </div>
    )
  );
};

export default StatusMedia;
