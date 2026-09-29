import { useContext } from "react";
import { UserInfoContext } from "../userInfo/UserInfoContexts";

export const useUserInfo = () => useContext(UserInfoContext);