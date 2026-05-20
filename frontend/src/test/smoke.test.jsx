import { render, screen } from "./utils";

describe("Test infrastructure", () => {
  it("renders with all providers without throwing", () => {
    render(<div data-testid="smoke">hello</div>);
    expect(screen.getByTestId("smoke")).toBeInTheDocument();
  });
});
