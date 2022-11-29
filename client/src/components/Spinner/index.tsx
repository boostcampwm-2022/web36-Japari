/** @jsxImportSource @emotion/react */
import { Oval } from "react-loader-spinner";
import * as style from "./styles";

const Spinner = () => {
  return (
    <div css={style.SpinnerContainerStyle}>
      <Oval
        height={80}
        width={80}
        color="white"
        ariaLabel="oval-loading"
        secondaryColor="rgba(32, 32, 32, 0.2)"
        strokeWidth={4}
        strokeWidthSecondary={4}
      />
    </div>
  );
};

export default Spinner;
