import { atom } from "recoil";

const refreshFreshData = atom({
  key: "fetch", // Unique ID (with respect to other atoms/selectors)
  default: false, // Default value (initial value)
});

export default refreshFreshData;
