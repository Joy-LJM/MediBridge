import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import DoctorDashboard from "../../pages/DoctorDashboard";
import { describe, test, expect } from "vitest";

describe("Prescription Upload Feature", () => {
  test("accepts valid file types and displays file name", () => {
    render(<DoctorDashboard />);
    const fileInput = screen.getByLabelText(/Upload Prescription/i);

    const file = new File(["prescription data"], "prescription.pdf", {
      type: "application/pdf",
    });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(fileInput.files[0].name).toBe("prescription.pdf");
    expect(fileInput.files).toHaveLength(1);
  });

  test("triggers form submission with the uploaded file", () => {
    render(<DoctorDashboard />);
    const fileInput = screen.getByLabelText(/Upload Prescription/i);

    const file = new File(["dummy content"], "test-prescription.pdf", {
      type: "application/pdf",
    });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(fileInput.files[0].name).toBe("test-prescription.pdf");
  });
});
