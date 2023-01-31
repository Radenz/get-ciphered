<script lang="ts">
  import { FileDropzone } from "@skeletonlabs/skeleton";
  import { chunked } from "../../cipher/utils/char";
  import { AffineCipher } from "../../cipher/affine";
  import { Action, saveBinary, saveText } from "../../utils/save";
  import { gcd } from "../../cipher/utils/math";

  export let cipher: AffineCipher;
  export let forBinary: boolean = false;

  let alertMessage: string = "";
  let alertType = "warning";

  let source: Uint8Array;
  let result: Uint8Array = new Uint8Array([]);
  let resultString: string = "";
  let files: FileList;
  let fileName: string;
  let fileType: string;
  let action: Action;
  let multiplier: number;
  let offset: number;

  function encrypt() {
    if (!ensureInput()) return;
    if (!ensureKey()) return;
    action = Action.ENCRYPT;
    cipher = new AffineCipher(multiplier, offset);
    result = cipher.encryptBytes(source);
    resultString = String.fromCharCode(...result);
    checkBinaryChar();
  }

  function decrypt() {
    if (!ensureInput()) return;
    if (!ensureKey()) return;
    action = Action.DECRYPT;
    cipher = new AffineCipher(multiplier, offset);
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

  function ensureKey() {
    clear();
    if (!multiplier) {
      error("multiplier cannot be empty!");
      return false;
    }
    if (!offset) {
      error("offset cannot be empty!");
      return false;
    }
    if ( /[^0-9]/.test(offset.toString()) || /[^0-9]/.test(multiplier.toString())) {
        error("Multiplier or Offset can only contain number!");
        return false;
    }

    if (gcd(26, multiplier) != 1){
      error("Can't use this multiplier number!");
      return false;
    }

    return true;
  }

  function ensureInput(){
    clear();
    if (!source){
      error("Input is empty!");
      return false;
    }
    return true
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

<div class="grow grid grid-rows-[1fr_auto] gap-4 h-full overflow-hidden">
  <div class="grid grid-cols-[1fr_1fr] gap-6 overflow-hidden">
    <div class="grid grid-rows-[1fr_auto] gap-4">
      <FileDropzone
        bind:files
        height="h-full"
        notes="File should be a plaintext."
        on:change={onChange}
      />
      <h4>{fileLabel}</h4>
    </div>
    <div
      class="input-label h-full box-border grid grid-rows-[auto_1fr_auto] overflow-hidden"
    >
      <h4>Result</h4>
      <div
        class="bg-surface-700 rounded-md border-surface-500 border box-border p-2 overflow-y-scroll"
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
        <h4 class="">Multiplier</h4>
        <input type="text" bind:value={multiplier} class="h-8 text-input" />  
      </label>
      <label class="input-label box-border flex items-center gap-4 grow">
        <h4 class="mt-0">Offset</h4>
        <input type="text" bind:value={offset} class="h-8 text-input" />
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
