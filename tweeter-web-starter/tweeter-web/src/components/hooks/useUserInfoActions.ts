import { useContext } from "react";
import { UserInfoActionsContext } from "../userInfo/UserInfoContexts";

export const useUserInfoActions = () => useContext(UserInfoActionsContext);