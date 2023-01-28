<script lang="ts">
  import { chunked } from "../../cipher/utils/char";
  import type { VigenereCipher } from "../../cipher/vigenere";
  import { saveText } from "../../utils/save";

  export let cipher: VigenereCipher;
  export let forBinary: boolean = false;

  let alertMessage: string = "";
  let alertType = "warning";

  let source: string;
  let result: string = "";
  let key: string;

  function encrypt() {
    if (!ensureKey()) return;
    if (!forBinary && /[^A-Za-z\s]/.test(source))
      warn("Any non-letter characters is ignored.");
    cipher.setKey(key);
    result = cipher.encryptString(source);
    checkBinaryChar();
  }

  function decrypt() {
    if (!ensureKey()) return;
    if (!forBinary && /[^A-Za-z\s]/.test(source))
      warn("Any non-letter characters is ignored.");
    cipher.setKey(key);
    result = cipher.decryptString(source);
    checkBinaryChar();
  }

  function checkBinaryChar() {
    if (forBinary && /[\x00-\x08\x0E-\x1F\x7F-\xFF]/.test(result)) {
      warn(
        "The result might contain non displayable characters. Consider downloading as a file."
      );
    }
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

  function compact() {
    result = result.replaceAll(" ", "");
  }

  function chunk() {
    if (result.includes(" ")) return;
    const chunks = chunked(result, 5);
    result = chunks.join(" ");
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
</script>

<div class="grow grid grid-rows-[1fr_auto] gap-4 h-full">
  <div class="grid grid-cols-[1fr_1fr] gap-6">
    <div class="h-full">
      <label class="input-label box-border grid grid-rows-[auto_1fr] h-full">
        <h4>Input</h4>
        <textarea bind:value={source} class="resize-none" />
      </label>
    </div>
    <div class="input-label h-full box-border grid grid-rows-[auto_1fr_auto]">
      <h4>Result</h4>
      <div
        class="bg-surface-700 rounded-md border-surface-500 border box-border p-2"
      >
        {result}
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
          on:click={() => {
            saveText(result, "encrypted.txt");
          }}
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
