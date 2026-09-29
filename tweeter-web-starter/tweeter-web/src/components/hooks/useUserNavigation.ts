import { FakeData } from "tweeter-shared";
import { ToastType } from "../toaster/Toast";
import { useNavigate } from "react-router-dom";
import { useMessageActions } from "./useMessageActions";
import { useUserInfo } from "./useUserInfo";
import { useUserInfoActions } from "./useUserInfoActions";

export const useUserNavigation = (featurePath: string) => {
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayToast } = useMessageActions();
  const navigate = useNavigate();

  return async (
    event: React.MouseEvent<HTMLAnchorElement>,
    alias: string
  ): Promise<void> => {
    event.preventDefault();

    try {
      if (!authToken) {
        throw new Error("User is not authenticated");
      }

      const toUser = await FakeData.instance.findUserByAlias(alias);

      if (toUser && !toUser.equals(displayedUser!)) {
        setDisplayedUser(toUser);
        navigate(`${featurePath}/${toUser.alias}`);
      }
    } catch (error) {
      displayToast(
        ToastType.Error,
        `Failed to get user because of exception: ${error}`,
        0
      );
    }
  };
};