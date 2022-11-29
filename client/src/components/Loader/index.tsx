/** @jsxImportSource @emotion/react */
import { Oval } from "react-loader-spinner";
import Spinner from "./Spinner";
import * as style from "./styles";

const Loader = () => {
  return (
    <div css={style.LoaderContainerStyle}>
      <Spinner color="white" />
    </div>
  );
};

export default Loader;
