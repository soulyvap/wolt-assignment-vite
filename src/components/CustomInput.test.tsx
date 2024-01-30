import { describe, expect, it } from "vitest";
import { fireEvent, render, renderHook, screen } from "@testing-library/react";
import CustomInput from "./CustomInput";
import { useState } from "react";

describe("CustomInput component", () => {
  it("should render", () => {
    render(
      <CustomInput
        label={"test-label"}
        dataTestId={"test-input"}
        trailingText="test-trailing-text"
      />
    );

    const label = screen.getByLabelText("test-label");
    expect(label).toBeDefined();

    const inputElement = screen.getByTestId("test-input");
    expect(inputElement).toBeDefined();

    const trailingText = screen.getByText("test-trailing-text");
    expect(trailingText).toBeDefined();
  });

  it("should update input value", async () => {
    const { result } = renderHook(() => useState(""));

    render(
      <CustomInput
        label={"test-label"}
        value={result.current[0]}
        dataTestId={"test-input"}
        onChange={(value) => result.current[1](value)}
      />
    );

    const inputElement = screen.getByTestId("test-input") as HTMLInputElement;

    expect(inputElement).toBeDefined();

    fireEvent.change(inputElement, { target: { value: "Hello" } });

    expect(result.current[0]).toBe("Hello");
  });
});
