import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { getLoggedInUser } from "../api/user";
import { userState } from "../store/user";

function useSetUser() {
  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    if (!user) {
      getLoggedInUser().then(res => {
        setUser(res);
      });
      return;
    }
  }, [user, setUser]);
}

export default useSetUser;
