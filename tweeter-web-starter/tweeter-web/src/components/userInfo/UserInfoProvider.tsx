import { useCallback, useMemo, useState } from "react";
import { User, AuthToken } from "tweeter-shared";
import { UserInfoContext, UserInfoActionsContext } from "./UserInfoContexts";
import { UserInfo } from "./UserInfo";
import { UserInfoService } from "../../model.service/UserInfoService";

interface Props {
  children: React.ReactNode;
}

const UserInfoProvider: React.FC<Props> = ({ children }) => {
  const userInfoService = useMemo(() => new UserInfoService(), []);
  const [userInfo, setUserInfo] = useState<UserInfo>(() =>
    userInfoService.retrieve(),
  );

  const updateUserInfo = useCallback(
    (
      currentUser: User,
      displayedUser: User | null,
      authToken: AuthToken,
      remember: boolean = false
    ) => {
      setUserInfo(() => {
        return {
          currentUser: currentUser,
          displayedUser: displayedUser,
          authToken: authToken,
        };
      });

      if (remember) {
        userInfoService.save(currentUser, authToken);
      }
    },
    [userInfoService]
  );

  const clearUserInfo = useCallback(() => {
    setUserInfo(() => {
      return {
        currentUser: null,
        displayedUser: null,
        authToken: null,
      };
    });

    userInfoService.clear();
  }, [userInfoService]);

  const setDisplayedUser = useCallback((user: User) => {
    setUserInfo((previous) => {
      return { ...previous, displayedUser: user };
    });
  }, []);

  const userInfoActions = useMemo(
    () => ({
      updateUserInfo,
      clearUserInfo,
      setDisplayedUser,
    }),
    [updateUserInfo, clearUserInfo, setDisplayedUser]
  );

  return (
    <UserInfoContext.Provider value={userInfo}>
      <UserInfoActionsContext.Provider value={userInfoActions}>
        {children}
      </UserInfoActionsContext.Provider>
    </UserInfoContext.Provider>
  );
};

export default UserInfoProvider;
