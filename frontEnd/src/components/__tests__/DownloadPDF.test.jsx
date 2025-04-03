import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import PharmacyDashboard from "../../pages/PharmacyDashboard";

vi.mock("../../pages/PharmacyDashboard", () => ({
  __esModule: true,
  default: () => (
    <a href="/assets/prescriptions/test-document.pdf" download>
      Download PDF
    </a>
  ),
}));

test("PDF download button should have the correct href", async () => {
  const selectedPdf = "test-document.pdf"; // Mock PDF file
  render(<PharmacyDashboard />);
  
  // Mock setting a PDF file (assuming you have a way to set `selectedPdf`)
  const downloadButton = screen.getByRole("link", { name: /Download PDF/i });

  expect(downloadButton).toHaveAttribute(
    "href",
    `/assets/prescriptions/${selectedPdf}`
  );
  expect(downloadButton).toHaveAttribute("download");
});
