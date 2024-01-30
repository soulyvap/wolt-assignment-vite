import { act, renderHook } from "@testing-library/react-hooks";
import { describe, expect, it } from "vitest";
import useForm from "./useForm";

describe("useForm hook", () => {
  it("should update a single value from values when using handleValueChange", () => {
    // Render the hook
    const { result } = renderHook(() =>
      useForm<{
        testString: string;
        testNum: number;
        testDate: Date;
      }>({
        testString: "hello",
        testNum: 10,
        testDate: new Date("08-02-1995"),
      })
    );
    
    // Change the value of testString
    act(() => {
      result.current.handleValueChange("testString", "moi");
    });
    expect(result.current.values.testString).toBe("moi");
    expect(result.current.values.testNum).toBe(10);
    expect(result.current.values.testDate).toStrictEqual(
      new Date("08-02-1995")
    );
  });
  
  it("should reset all values to initial values, except for values.orderTime which should be set to current browser Date, when using reset", () => {
    const { result } = renderHook(() =>
      useForm<{
        testString: string;
        testNum: number;
        testDate: Date;
      }>({
        testString: "hello",
        testNum: 10,
        testDate: new Date("08-02-1995"),
      })
    );

    act(() => {
      result.current.handleValueChange("testString", "moi");
    });
    expect(result.current.values.testString).toBe("moi");

    act(() => {
      result.current.handleValueChange("testNum", 100);
    });
    expect(result.current.values.testNum).toBe(100);

    act(() => {
      result.current.handleValueChange("testDate", new Date("08-02-2000"));
    });
    expect(result.current.values.testDate).toStrictEqual(new Date("08-02-2000"));
    
    act(() => {
      result.current.reset();
    });
    expect(result.current.values.testString).toBe("hello");
    expect(result.current.values.testNum).toBe(10);
    expect(result.current.values.testDate).toStrictEqual(
      new Date("08-02-1995")
    );
  });
});
