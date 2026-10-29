import { useCallback, useContext, useMemo, type MouseEvent } from "react";
import { UserInfoActionsContext, UserInfoContext } from "./UserInfoContexts";
import { useNavigate } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import { UserNavigationPresenter } from "../../presenter/UserNavigationPresenter";

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
  const presenter = useMemo(
    () =>
      new (class extends UserNavigationPresenter {
        constructor(view: {
          setDisplayedUser: typeof setDisplayedUser;
          navigate: typeof navigate;
          displayErrorMessage: typeof displayErrorMessage;
        }) {
          super(view);
        }
      })({ setDisplayedUser, navigate, displayErrorMessage }),
    [setDisplayedUser, navigate, displayErrorMessage],
  );
  return useCallback(async (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const alias = event.currentTarget.textContent?.trim();
    if (alias && authToken) {
      await presenter.navigateToUser(
        authToken,
        displayedUser,
        alias,
        featurePath,
      );
    }
  }, [authToken, displayedUser, featurePath, presenter]);
};
