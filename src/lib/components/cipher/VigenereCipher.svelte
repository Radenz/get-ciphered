<script lang="ts">
  import { chunked } from "../../cipher/utils/char";
  import type { VigenereCipher } from "../../cipher/vigenere";

  export let cipher: VigenereCipher;

  let source: string;
  let result: string = "";
  let key: string;
  let resultContainer: HTMLDivElement;

  function encrypt() {
    cipher.setKey(key);
    result = cipher.encryptString(source);
    compact();
  }

  function decrypt() {
    cipher.setKey(key);
    result = cipher.decryptString(source);
    compact();
  }

  function compact() {
    result = result.replaceAll(" ", "");
  }

  function chunk() {
    const chunks = chunked(result, 5);
    result = chunks.join(" ");
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
    <div class="input-label h-full box-border grid grid-rows-[auto_1fr]">
      <h4>Result</h4>
      <div
        bind:this={resultContainer}
        class="bg-surface-700 rounded-md border-surface-500 border box-border p-2"
      >
        {result}
      </div>
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
          on:click={decrypt}
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
