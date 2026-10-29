import { MemoryRouter } from "react-router-dom";
import Login from "../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { LoginPresenter } from "../../../src/presenter/LoginPresenter";
import { anything, instance, mock, verify, when } from "@typestrong/ts-mockito";

library.add(fab);

describe("Login Component", () => {
  it("starts with the sign in button disabled", () => {
    const { signInButton } = renderLoginAndGetElements("/");
    expect(signInButton).toBeDisabled();
  });

  it("enables the sign in button if both fields have text", async () => {
    const { user, signInButton, aliasField, passwordField } =
      renderLoginAndGetElements("/");

    await user.type(aliasField, "it me");
    await user.type(passwordField, "teehee");
    expect(signInButton).toBeEnabled();
  });

  it("disabels sign in button if they clear a field", async () => {
    const { user, signInButton, aliasField, passwordField } =
      renderLoginAndGetElements("/");

    await user.type(aliasField, "it me");
    await user.type(passwordField, "teehee");
    expect(signInButton).toBeEnabled();

    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();

    await user.type(aliasField, "it me");
    expect(signInButton).toBeEnabled();

    await user.clear(passwordField);
    expect(signInButton).toBeDisabled();
  });

  it("calls the presenter's login method with correct params when sign in button is clicked", async () => {
    const mockPresenter = mock<LoginPresenter>();
    const mockPresenterInstance = instance(mockPresenter);
    when(mockPresenter.canSubmit(anything(), anything())).thenReturn(true);

    const originalUrl = "http.somewhere.org";
    const alias = "@alias";
    const password = "secret";
    const rememberMe = false;

    const { user, signInButton, aliasField, passwordField } =
      renderLoginAndGetElements(originalUrl, mockPresenterInstance);

    await user.type(aliasField, alias);
    await user.type(passwordField, password);
    await user.click(signInButton);

    verify(mockPresenter.login(alias, password, rememberMe, originalUrl)).once();
  });
});

function renderLogin(originalUrl: string, presenter?: LoginPresenter) {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <Login originalUrl={originalUrl} presenter={presenter} />
      ) : (
        <Login originalUrl={originalUrl} />
      )}
    </MemoryRouter>,
  );
}

function renderLoginAndGetElements(
  originalUrl: string,
  presenter?: LoginPresenter,
) {
  const user = userEvent.setup();

  renderLogin(originalUrl, presenter);

  const signInButton = screen.getByRole("button", { name: /Sign in/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  return { user, signInButton, aliasField, passwordField };
}
