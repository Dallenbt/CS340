import { AuthToken, Status, User } from "tweeter-shared";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenter/PostStatusPresenter";
import {
  instance,
  mock,
  verify,
  spy,
  when,
  capture,
  anything,
} from "@typestrong/ts-mockito";
import { StatusService } from "../../src/model.service/StatusService";

describe("PostStatusPresenter", () => {
  let mockPostStatusPresenterView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let mockService: StatusService;
  let currentUser: User;

  const authToken = new AuthToken("abc123", Date.now());

  beforeEach(() => {
    mockPostStatusPresenterView = mock<PostStatusView>();
    const mockPostStatusPresenterViewInstance = instance(
      mockPostStatusPresenterView,
    );
    when(mockPostStatusPresenterView.displayInfoMessage(anything(), 0)).thenReturn(
      "messageId123",
    );

    const postStatusPresenterSpy = spy(
      new PostStatusPresenter(mockPostStatusPresenterViewInstance),
    );
    postStatusPresenter = instance(postStatusPresenterSpy);

    mockService = mock<StatusService>();
    when((postStatusPresenterSpy as any).service).thenReturn(instance(mockService));
  });

  it("tells the view to display a posting status message", async () => {
    currentUser = new User("Test", "User", "testuser", "profile.png");

    await postStatusPresenter.submit("Hello world", authToken, currentUser);

    verify(mockPostStatusPresenterView.displayInfoMessage("Posting status...", 0)).once();
  });

  it("calls postStatus on the post status service with the correct status string and auth token", async () => {
    currentUser = new User("Test", "User", "testuser", "profile.png");

    await postStatusPresenter.submit("Hello world", authToken, currentUser);

    verify(mockService.postStatus(authToken, anything())).once();

    const [capturedAuthToken, capturedStatus] = capture(mockService.postStatus).last();
    expect(capturedAuthToken).toEqual(authToken);
    expect(capturedStatus).toBeInstanceOf(Status);
  });

  it("tells the view to clear the info message that was displayed previously, clear the post, and display a status posted message when successful", async () => {
    currentUser = new User("Test", "User", "testuser", "profile.png");

    await postStatusPresenter.submit("Hello world", authToken, currentUser);

    verify(mockPostStatusPresenterView.deleteMessage("messageId123")).once();
    verify(mockPostStatusPresenterView.setPost("")).once();
    verify(mockPostStatusPresenterView.displayInfoMessage("Status posted!", 2000)).once();
    verify(mockPostStatusPresenterView.displayErrorMessage(anything())).never();
  });

  it("tells the view to clear the info message and display an error message but does not tell it to clear the post or display a status posted message when unsuccessful", async () => {
    currentUser = new User("Test", "User", "testuser", "profile.png");
    const error = new Error("Fail");
    when(mockService.postStatus(anything(), anything())).thenThrow(error);

    await postStatusPresenter.submit("Hello world", authToken, currentUser);

    verify(mockPostStatusPresenterView.deleteMessage("messageId123")).once();
    verify(mockPostStatusPresenterView.setPost("")).never();
    verify(mockPostStatusPresenterView.displayInfoMessage("Status posted!", 2000)).never();
    verify(
      mockPostStatusPresenterView.displayErrorMessage(
        "Failed to post status because of exception: Fail",
      ),
    ).once();
  });
});
