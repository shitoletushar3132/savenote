import { atom } from "recoil";

const testAtom = atom({
  key: "testAtom", // Unique ID (with respect to other atoms/selectors)
  default: "", // Default value (initial value)
});

export default testAtom;
