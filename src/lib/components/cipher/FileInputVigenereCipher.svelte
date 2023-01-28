<script lang="ts">
  import { FileDropzone } from "@skeletonlabs/skeleton";
  import { chunked } from "../../cipher/utils/char";
  import type { VigenereCipher } from "../../cipher/vigenere";
  import { Action, saveBinary } from "../../utils/save";

  export let cipher: VigenereCipher;
  export let forBinary: boolean = false;

  let alertMessage: string = "";
  let alertType = "warning";

  let source: Uint8Array;
  let result: Uint8Array = new Uint8Array([]);
  let resultString: string = "";
  let key: string;
  let files: FileList;
  let fileName: string;
  let fileType: string;
  let action: Action;

  function encrypt() {
    if (!ensureKey()) return;
    if (!forBinary && /[^A-Za-z\s]/.test(String.fromCharCode(...source)))
      warn("Any non-letter characters is ignored.");
    action = Action.ENCRYPT;
    cipher.setKey(key);
    result = cipher.encryptBytes(source);
    resultString = String.fromCharCode(...result);
    checkBinaryChar();
  }

  function decrypt() {
    if (!ensureKey()) return;
    if (!forBinary && /[^A-Za-z\s]/.test(String.fromCharCode(...source)))
      warn("Any non-letter characters is ignored.");
    action = Action.DECRYPT;
    cipher.setKey(key);
    result = cipher.decryptBytes(source);
    resultString = String.fromCharCode(...result);
    checkBinaryChar();
  }

  function compact() {
    resultString = resultString.replaceAll(" ", "");
  }

  function chunk() {
    if (resultString.includes(" ")) return;
    const chunks = chunked(resultString, 5);
    resultString = chunks.join(" ");
  }

  async function onChange() {
    const file = files[0];
    fileName = file.name;
    fileType = file.type;
    source = new Uint8Array(await file.arrayBuffer());
  }

  function save() {
    let name =
      action == Action.ENCRYPT
        ? `encrypted-${fileName}`
        : fileName.startsWith("encrypted-")
        ? fileName.replace("encrypted-", "")
        : `decrypted-${fileName}`;
    saveBinary(result, name, fileType);
  }

  function ensureKey() {
    clear();
    if (!key) {
      error("Key cannot be empty!");
      return false;
    }

    if (!forBinary && /[^A-Za-z]/.test(key)) {
      error("Key can only contain alphabet letters!");
      return false;
    }

    return true;
  }

  function checkBinaryChar() {
    if (forBinary && /[\x00-\x08\x0E-\x1F\x7F-\xFF]/.test(resultString)) {
      warn(
        "The result might contain non displayable characters. Consider downloading as a file."
      );
    }
  }

  function warn(message: string) {
    alertMessage = message;
    alertType = "warning";
  }

  function error(message: string) {
    alertMessage = message;
    alertType = "error";
  }

  function clear() {
    alertMessage = "";
  }

  $: fileLabel = fileName ? `File: ${fileName}` : "No file chosen";
</script>

<div class="grow grid grid-rows-[1fr_auto] gap-4 h-full">
  <div class="grid grid-cols-[1fr_1fr] gap-6">
    <div class="grid grid-rows-[1fr_auto] gap-4">
      <FileDropzone
        bind:files
        height="h-full"
        notes="File should be a plaintext."
        on:change={onChange}
      />
      <h4>{fileLabel}</h4>
    </div>
    <div class="input-label h-full box-border grid grid-rows-[auto_1fr_auto]">
      <h4>Result</h4>
      <div
        class="bg-surface-700 rounded-md border-surface-500 border box-border p-2"
      >
        <p class="break-all">
        {resultString}
        </p>
      </div>
      {#if alertMessage}
        <div>
          {#if alertType == "warning"}
            <div class="alert variant-ghost-warning">{@html alertMessage}</div>
          {:else if alertType == "error"}
            <div class="alert variant-ghost-error">{@html alertMessage}</div>
          {/if}
        </div>
      {/if}
    </div>
  </div>
  <div class="grid grid-cols-[1fr_1fr] gap-6">
    <div class="flex items-center justify-between gap-6">
      <label class="input-label box-border flex items-center gap-4 grow">
        <h4>Key</h4>
        <input type="text" bind:value={key} class="h-8 text-input" />
      </label>
      <div class="flex gap-4">
        <button
          class="btn btn-sm variant-filled-primary font-label font-semibold"
          on:click={encrypt}
        >
          Encrypt
        </button>
        <button
          class="btn btn-sm variant-filled-primary font-label font-semibold"
          on:click={decrypt}
        >
          Decrypt
        </button>
      </div>
    </div>
    <div class="flex justify-between items-center">
      <div class="flex gap-4 items-center">
        <h4>Format:</h4>
        <button
          class="btn btn-sm variant-filled-primary font-label font-semibold"
          on:click={compact}
        >
          Compact
        </button>
        <button
          class="btn btn-sm variant-filled-primary font-label font-semibold"
          on:click={chunk}
        >
          Chunked
        </button>
      </div>
      <div>
        <button
          class="btn btn-sm variant-filled-primary font-label font-semibold"
          on:click={save}
        >
          Download
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .text-input {
    margin-top: 0 !important;
  }
</style>
