import React from "react";
import { createRoot } from "react-dom/client";

document.addEventListener("DOMContentLoaded", function() {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(React.createElement("h1", null, "测试渲染 - webpack版本"));
  } else {
    console.error("找不到root元素!");
  }
});