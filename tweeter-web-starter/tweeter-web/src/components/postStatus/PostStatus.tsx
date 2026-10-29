import "./PostStatus.css";
import { useRef, useState } from "react";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo } from "../userInfo/UserHooks";
import { PostStatusPresenter } from "../../presenter/PostStatusPresenter";

interface Props {
  presenter?: PostStatusPresenter;
}

const PostStatus = (props: Props) => {
  const { displayInfoMessage, deleteMessage, displayErrorMessage } =
    useMessageActions();
  const { currentUser, authToken } = useUserInfo();
  const [post, setPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const presenter = useRef<PostStatusPresenter | null>(null);
  if (!presenter.current) {
    presenter.current =
      props.presenter ??
      new PostStatusPresenter({
        setPost,
        setLoading: setIsLoading,
        displayInfoMessage,
        deleteMessage,
        displayErrorMessage,
      });
  }

  const canSubmit = presenter.current.canSubmit(
    post,
    authToken,
    currentUser,
    isLoading,
  );

  return (
    <form>
      <div className="form-group mb-3">
        <textarea
          className="form-control"
          id="postStatusTextArea"
          rows={10}
          placeholder="What's on your mind?"
          value={post}
          onChange={(event) => setPost(event.target.value)}
        />
      </div>
      <div className="form-group">
        <button
          id="postStatusButton"
          className="btn btn-md btn-primary me-1"
          type="button"
          disabled={!canSubmit}
          style={{ width: "8em" }}
          onClick={() => {
            if (authToken && currentUser) {
              void presenter.current!.submit(post, authToken, currentUser);
            }
          }}
        >
          {isLoading ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            <div>Post Status</div>
          )}
        </button>
        <button
          id="clearStatusButton"
          className="btn btn-md btn-secondary"
          type="button"
          disabled={!canSubmit}
          onClick={(event) => presenter.current!.clear(event)}
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default PostStatus;
