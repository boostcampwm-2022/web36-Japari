/** @jsxImportSource @emotion/react */
import micOn from "../../../assets/icons/mic-on.svg";
import micOff from "../../../assets/icons/mic-off.svg";
import camOn from "../../../assets/icons/cam-on.svg";
import camOff from "../../../assets/icons/cam-off.svg";
import * as style from "./styles";
import { useRecoilState, useRecoilValue } from "recoil";
import { audioState, videoState, streamState } from "./../../../store/media";
import { socketState } from "../../../store/socket";
import { useEffect } from "react";

const StatusMedia = () => {
  const stream = useRecoilValue(streamState);
  const [audio, setAudio] = useRecoilState(audioState);
  const [video, setVideo] = useRecoilState(videoState);
  const socket = useRecoilValue(socketState);

  return (
    stream && (
      <div css={style.micCamContainerStyle}>
        <div
          css={style.micCamButtonStyle}
          onClick={() => {
            socket.emit("audio-status/modify", { audioStatus: !audio });
            setAudio(audio => !audio);
            stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
          }}
        >
          {audio ? <img src={micOn} alt="micOn" /> : <img src={micOff} alt="micOff" />}
        </div>
        <div
          css={style.micCamButtonStyle}
          onClick={() => {
            socket.emit("video-status/modify", { videoStatus: !video });
            setVideo(video => !video);
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
