<script lang="ts">
  import { FileDropzone } from "@skeletonlabs/skeleton";
  import { chunked } from "../../cipher/utils/char";
  import { HillCipher } from "../../cipher/hill";
  import { Action, saveBinary, saveText } from "../../utils/save";
  import { ModulusMatrix } from "../../cipher/utils/math";
  import Matrix from "../Matrix.svelte";

  export let cipher: HillCipher;
  export let forBinary: boolean = false;

  let alertMessage: string = "";
  let alertType = "warning";

  let source: Uint8Array;
  let result: Uint8Array = new Uint8Array([]);
  let resultString: string = "";
  let key: string;
  let keyMatrix: ModulusMatrix;
  let matrix: number[][];
  let files: FileList;
  let fileName: string;
  let fileType: string;
  let action: Action;
  let size: number = 2;

  function encrypt() {
    if (!ensureInput()) return;
    if (!ensureKey()) return;
    action = Action.ENCRYPT;
    keyMatrix = ModulusMatrix.fromSquare(matrix, 256);
    cipher = new HillCipher(keyMatrix);
    result = cipher.encryptBytes(source);
    resultString = String.fromCharCode(...result);
    checkBinaryChar();
  }

  function decrypt() {
    if (!ensureInput()) return;
    if (!ensureKey()) return;
    action = Action.DECRYPT;
    keyMatrix = ModulusMatrix.fromSquare(matrix, 256);
    cipher = new HillCipher(keyMatrix);
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
    saveText(resultString, name);
  }

  function ensureInput() {
    clear();
    if (!source) {
      error("Input is empty!");
      return false;
    }
    return true;
  }

  function ensureKey() {
    clear();
    if (!key) {
      error("Key cannot be empty!");
      return false;
    }

    if (/[^0-9\s]/.test(key.toString())) {
      error("Key Matrix can only contain number!");
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

  function incrementSize() {
    size++;
  }

  function decrementSize() {
    if (size > 2) size--;
  }

  $: fileLabel = fileName ? `File: ${fileName}` : "No file chosen";
</script>

<div class="grow grid grid-rows-[1fr_auto] gap-4 h-full overflow-hidden">
  <div class="grid grid-cols-[3fr_2fr_3fr] gap-6 overflow-hidden">
    <div class="grid grid-rows-[1fr_auto] gap-4">
      <FileDropzone
        bind:files
        height="h-full"
        notes="File should be a plaintext."
        on:change={onChange}
      />
      <h4>{fileLabel}</h4>
    </div>
    <div class="h-full">
      <h4 class="mb-2">Key Matrix</h4>
      <Matrix {size} bind:matrix />
      <div class="mt-4 flex items-center gap-4">
        <h4>Size: {size}</h4>
        <button
          class="btn btn-sm variant-filled-primary font-label font-semibold"
          on:click={incrementSize}
        >
          +
        </button>
        <button
          class="btn btn-sm variant-filled-primary font-label font-semibold"
          on:click={decrementSize}
        >
          -
        </button>
      </div>
    </div>
    <div
      class="input-label h-full box-border grid grid-rows-[auto_1fr_auto] overflow-hidden"
    >
      <h4>Result</h4>
      <div
        class="bg-surface-700 rounded-md border-surface-500 border box-border p-2 overflow-y-scroll"
      >
        <p class="break-all">
          {result}
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
  <div class="grid grid-cols-[3fr_2fr_3fr] gap-6">
    <div class="flex items-center justify-between gap-6">
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
    <div />
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
