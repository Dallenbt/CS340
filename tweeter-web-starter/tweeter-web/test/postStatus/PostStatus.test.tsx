import { AuthToken, User } from "tweeter-shared";
import Post from "../../src/components/postStatus/PostStatus";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { PostStatusPresenter } from "../../src/presenter/PostStatusPresenter";
import {
  anything,
  instance,
  mock,
  verify,
  when,
} from "@typestrong/ts-mockito";
import { UserInfoContext } from "../../src/components/userInfo/UserInfoContexts";

describe("Post Component", () => {
  it("starts with the post and clear button disabled", () => {
    const { postButton, clearButton } = renderPostAndGetElements();

    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("enables the post and clear buttons when the post has text", async () => {
    const { user, postButton, clearButton, postField } =
      renderPostAndGetElements();

    await user.type(postField, "Hello world");

    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  it("disables both buttons when the post text is cleared", async () => {
    const { user, postButton, clearButton, postField } =
      renderPostAndGetElements();

    await user.type(postField, "Hello world");
    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();

    await user.click(clearButton);

    expect(postField).toHaveValue("");
    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("calls the presenter's submit method when Post Status is clicked", async () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);
    when(
      mockPresenter.canSubmit(anything(), anything(), anything(), anything()),
    ).thenReturn(true);

    const { user, postButton, postField } =
      renderPostAndGetElements(mockPresenterInstance);
    const post = "Hello world";

    await user.type(postField, post);
    await user.click(postButton);

    verify(
      mockPresenter.submit(post, authToken, currentUser),
    ).once();
  });
});

const authToken = new AuthToken("test-token", Date.now());
const currentUser = new User("Test", "User", "testuser", "profile.png");

function renderPost(presenter?: PostStatusPresenter) {
  return render(
    <UserInfoContext.Provider
      value={{ currentUser, displayedUser: currentUser, authToken }}
    >
      <Post presenter={presenter} />
    </UserInfoContext.Provider>,
  );
}

function renderPostAndGetElements(presenter?: PostStatusPresenter) {
  const user = userEvent.setup();

  renderPost(presenter);

  const postButton = screen.getByRole("button", { name: /Post Status/i });
  const clearButton = screen.getByRole("button", { name: /Clear/i });
  const postField = screen.getByPlaceholderText("What's on your mind?");

  return { user, postButton, clearButton, postField };
}
