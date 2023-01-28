function saveText(text: string, name: string) {
  const blob = new Blob([text], { type: "text/plain" });
  const anchor = window.document.createElement("a");
  anchor.href = window.URL.createObjectURL(blob);
  anchor.download = name;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

export { saveText };
