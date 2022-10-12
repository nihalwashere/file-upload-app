import { useState } from "react";

export const useMergeState = (initialState) => {
  const [state, setState] = useState(initialState);

  const setMergedState = (newState) =>
    setState((prevState) => ({ ...prevState, ...newState }));

  return [state, setMergedState];
};
