import { render, screen } from "@testing-library/react";
import Greeting from "../../components/Greeting";

test("displays the correct greeting message", () => {
  render(<Greeting name="John" />);

  // Check if the greeting message is in the document
  expect(screen.getByText("Hello, John!")).toBeInTheDocument();
});
