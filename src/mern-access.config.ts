import { defineMernAccessConfig } from "mern-access-client";

export default defineMernAccessConfig({
  baseUrl: import.meta.env.VITE_AUTHAPI_URL + "/auth",
  storageKey: "9943577a4b314dfeec97dd0e654a494c",
  onAuthError: (err) => console.warn("[mern-access-client] auth error:", err)
});