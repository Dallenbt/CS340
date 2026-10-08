import "./UserInfoComponent.css";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "./UserHooks";
import { UserInfoPresenter } from "../../presenter/UserInfoPresenter";

const UserInfo = () => {
  const [isFollower, setIsFollower] = useState(false);
  const [followeeCount, setFolloweeCount] = useState(-1);
  const [followerCount, setFollowerCount] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const { displayErrorMessage, deleteMessage, displayInfoMessage } =
    useMessageActions();
  const { currentUser, authToken, displayedUser } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const navigate = useNavigate();
  const location = useLocation();

  const presenter = useRef<UserInfoPresenter | null>(null);
  if (!presenter.current) {
    presenter.current = new UserInfoPresenter({
      setIsFollower,
      setFollowerCount,
      setFolloweeCount,
      setLoading: setIsLoading,
      setDisplayedUser,
      navigate,
      displayInfoMessage,
      deleteMessage,
      displayErrorMessage,
    });
  }

  useEffect(() => {
    if (currentUser && displayedUser && authToken) {
      void presenter.current!.initialize(authToken, currentUser, displayedUser);
    }
  }, [authToken, currentUser, displayedUser]);

  if (!currentUser || !displayedUser || !authToken) {
    return null;
  }

  const isCurrentUser = displayedUser.equals(currentUser);

  return (
    <div className="container">
      <div className="row">
        <div className="col-auto p-3">
          <img
            src={displayedUser.imageUrl}
            className="img-fluid"
            width="100"
            alt="Posting user"
          />
        </div>
        <div className="col p-3">
          {!isCurrentUser && (
            <p id="returnToLoggedInUser">
              Return to{" "}
              <Link
                to={`./${currentUser.alias}`}
                onClick={(event) =>
                  presenter.current!.switchToLoggedInUser(
                    event,
                    currentUser,
                    location.pathname,
                  )
                }
              >
                logged in user
              </Link>
            </p>
          )}
          <h2>
            <b>{displayedUser.name}</b>
          </h2>
          <h3>{displayedUser.alias}</h3>
          <br />
          {followeeCount > -1 && followerCount > -1 && (
            <div>
              Followees: {followeeCount} Followers: {followerCount}
            </div>
          )}
        </div>
        {!isCurrentUser && (
          <div className="form-group">
            {isFollower ? (
              <button
                id="unFollowButton"
                className="btn btn-md btn-secondary me-1"
                type="button"
                style={{ width: "6em" }}
                disabled={isLoading}
                onClick={() =>
                  void presenter.current!.unfollow(authToken, displayedUser)
                }
              >
                {isLoading ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : (
                  <div>Unfollow</div>
                )}
              </button>
            ) : (
              <button
                id="followButton"
                className="btn btn-md btn-primary me-1"
                type="button"
                style={{ width: "6em" }}
                disabled={isLoading}
                onClick={() =>
                  void presenter.current!.follow(authToken, displayedUser)
                }
              >
                {isLoading ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : (
                  <div>Follow</div>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
