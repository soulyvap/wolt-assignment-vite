import { useState } from "react";

/**
 * Hook for handling form values
 * @param initialState initial values of type T for the form
 */
const useForm = <T,>(initialState: T) => {

  const [values, setValues] = useState(initialState);

  /**
   * Reset the form to the initial state
   */
  const reset = () => {
    setValues(initialState);
  };

  /**
   * Updates a value in the form values given its property key
   * @param propKey  key of a property in an object of type T 
   * @param value value of type determined by conditional type based on propKey
   */
  const handleValueChange = <K extends keyof T>(propKey: K, value: T[K]) => {
    setValues({
      ...values,
      [propKey]: value,
    });
  };

  return {values, handleValueChange, reset};
}

export default useForm