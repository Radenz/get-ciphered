<script lang="ts">
  import { Tab, TabGroup } from "@skeletonlabs/skeleton";
  import { writable } from "svelte/store";
  import { chunked } from "./lib/cipher/utils/char";
  import { VigenereCipher } from "./lib/cipher/vigenere";

  let variant = writable("standard");
  let source: string;
  let result: string = "";
  let key: string;
  let resultContainer: HTMLDivElement;

  const vigenereStandard = VigenereCipher.standard("");

  function encrypt() {
    vigenereStandard.setKey(key);
    result = vigenereStandard.encryptString(source);
    compact();
  }

  function decrypt() {
    vigenereStandard.setKey(key);
    result = vigenereStandard.decryptString(source);
    compact();
  }

  function compact() {
    result = result.replaceAll(" ", "");
  }

  function chunk() {
    const chunks = chunked(result, 5);
    result = chunks.join(" ");
  }

  function download() {}
</script>

<div class="flex flex-col gap-4 h-full">
  <TabGroup selected={variant} justify="justify-center">
    <Tab value="standard">Standard</Tab>
    <Tab value="extended">Extended</Tab>
    <Tab value="autokey">Auto-Key</Tab>
  </TabGroup>
  {#if $variant == "standard"}
    <div class="grow grid grid-rows-[1fr_auto] gap-6 h-full">
      <div class="grid grid-cols-[1fr_1fr] gap-6">
        <div class="h-full">
          <label
            class="input-label box-border grid grid-rows-[auto_1fr] h-full"
          >
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
  {/if}
</div>

<style>
  .text-input {
    margin-top: 0 !important;
  }
</style>
