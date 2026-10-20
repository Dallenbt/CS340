import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface PostStatusView extends MessageView {
  setPost: (post: string) => void;
  setLoading: (loading: boolean) => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private readonly service = new StatusService();

  public constructor(view: PostStatusView) {
    super(view);
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
    await this.doFailureReportingOperation(async () => {
      this.view.setLoading(true);
      toastId = this.view.displayInfoMessage("Posting status...", 0);
      await this.service.postStatus(
        authToken,
        new Status(post, currentUser, Date.now()),
      );
      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    }, "post status", () => {
      try {
        if (toastId) {
          this.view.deleteMessage(toastId);
        }
      } finally {
        this.view.setLoading(false);
      }
    });
  }

  public clear(event: { preventDefault: () => void }): void {
    event.preventDefault();
    this.view.setPost("");
  }
}
