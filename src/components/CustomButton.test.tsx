import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import CustomButton from "./CustomButton";

describe("CustomButton component", () => {
  it("should render", () => {
    render(<CustomButton dataTestId={"test-button"}>Test</CustomButton>);

    const button = screen.getByTestId("test-button");
    expect(button).toBeDefined();
  });

  it("should update value on press", async () => {
    let value = "";

    const onPress = () => {
      value = "Hello";
    };
    render(
      <CustomButton onPress={onPress} dataTestId={"test-button"}>
        Test
      </CustomButton>
    );
    const button = screen.getByTestId("test-button");
    fireEvent.click(button);

    expect(value).toBe("Hello");
  });
});
