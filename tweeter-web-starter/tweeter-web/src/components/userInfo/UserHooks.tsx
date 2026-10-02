import { useContext, type MouseEvent } from "react";
import { UserInfoActionsContext, UserInfoContext } from "./UserInfoContexts";
import { AuthToken, FakeData, User } from "tweeter-shared";
import { useNavigate } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";

export const useUserInfoActions = () => {
  return useContext(UserInfoActionsContext);
};

export const useUserInfo = () => {
  return useContext(UserInfoContext);
};

export const useUserNavigation = (featurePath: string) => {
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const navigate = useNavigate();
  const { displayErrorMessage } = useMessageActions();
  const navigateToUser = async (
    event: MouseEvent<HTMLAnchorElement>,
  ): Promise<void> => {
    event.preventDefault();

    try {
      const alias = event.currentTarget.textContent?.trim();
      if (!alias) {
        return;
      }

      const toUser = await getUser(authToken!, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          setDisplayedUser(toUser);
          navigate(`${featurePath}/${toUser.alias}`);
        }
      }
    } catch (error) {
      displayErrorMessage(
        `Failed to get user because of exception: ${error}`,
        "text-white bg-danger",
      );
    }
  };

  const getUser = async (
    authToken: AuthToken,
    alias: string,
  ): Promise<User | null> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  };

  return navigateToUser;
};
