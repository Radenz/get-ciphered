<script lang="ts">
  import { FileDropzone } from "@skeletonlabs/skeleton";
  import { PlayfairCipher } from "../../cipher/playfair";
  import { chunked } from "../../cipher/utils/char";
  import { Action, saveText } from "../../utils/save";

  let alertMessage: string = "";
  let alertType = "warning";

  let source: string = "";
  let result: string = "";
  let key: string;
  let lastKey: string;
  let cipher: PlayfairCipher;
  let files: FileList;
  let fileName: string;
  let action: Action;

  function encrypt() {
    if (!ensureKey()) return;
    if (/[^A-Za-z\s]/.test(source))
      warn("Any non-letter characters is ignored.");
    action = Action.ENCRYPT;
    if (!lastKey || key != lastKey) {
      cipher = new PlayfairCipher(key);
    }
    result = cipher.encrypt(source);
    compact();
  }

  function decrypt() {
    if (!ensureKey()) return;
    if (/[^A-Za-z\s]/.test(source))
      warn("Any non-letter characters is ignored.");
    action = Action.DECRYPT;
    if (!lastKey || key != lastKey) {
      cipher = new PlayfairCipher(key);
    }
    result = cipher.decrypt(source);
    compact();
  }

  function compact() {
    result = result.replaceAll(" ", "");
  }

  function chunk() {
    if (result.includes(" ")) return;
    const chunks = chunked(result, 5);
    result = chunks.join(" ");
  }

  async function onChange() {
    const file = files[0];
    fileName = file.name;
    source = await file.text();
  }

  function save() {
    let name =
      action == Action.ENCRYPT
        ? `encrypted-${fileName}`
        : fileName.startsWith("encrypted-")
        ? fileName.replace("encrypted-", "")
        : `decrypted-${fileName}`;
    saveText(result, name);
  }

  function ensureKey() {
    clear();
    if (!key) {
      error("Key phrase cannot be empty!");
      return false;
    }

    return true;
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
  <div class="grid grid-cols-[1fr_1fr] gap-6">
    <div class="flex items-center justify-between gap-6">
      <label class="input-label box-border flex items-center gap-4 grow">
        <h4>Keyphrase</h4>
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
