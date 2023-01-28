function saveText(text: string, name: string) {
  const blob = new Blob([text], { type: "text/plain" });
  const anchor = window.document.createElement("a");
  anchor.href = window.URL.createObjectURL(blob);
  anchor.download = name;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

function saveBinary(data: Uint8Array, name: string, type: string) {
  const blob = new Blob([data], { type });
  const anchor = window.document.createElement("a");
  anchor.href = window.URL.createObjectURL(blob);
  anchor.download = name;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

enum Action {
  ENCRYPT,
  DECRYPT,
}

export { saveText, Action, saveBinary };
