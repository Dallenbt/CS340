import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";

export interface PostStatusView {
  setPost: (post: string) => void;
  setLoading: (loading: boolean) => void;
  displayInfoMessage: (message: string, duration: number) => string;
  deleteMessage: (messageId: string) => void;
  displayErrorMessage: (message: string, bootstrapClasses?: string) => void;
}

export class PostStatusPresenter {
  private readonly view: PostStatusView;
  private readonly service = new StatusService();

  public constructor(view: PostStatusView) {
    this.view = view;
  }

  public canSubmit(
    post: string,
    authToken: AuthToken | null,
    currentUser: User | null,
    isLoading: boolean,
  ): boolean {
    return !!post.trim() && !!authToken && !!currentUser && !isLoading;
  }

  public async submit(
    post: string,
    authToken: AuthToken,
    currentUser: User,
  ): Promise<void> {
    let toastId = "";
    try {
      this.view.setLoading(true);
      toastId = this.view.displayInfoMessage("Posting status...", 0);
      await this.service.postStatus(
        authToken,
        new Status(post, currentUser, Date.now()),
      );
      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`,
        "text-white bg-danger",
      );
    } finally {
      this.view.deleteMessage(toastId);
      this.view.setLoading(false);
    }
  }

  public clear(event: { preventDefault: () => void }): void {
    event.preventDefault();
    this.view.setPost("");
  }
}
