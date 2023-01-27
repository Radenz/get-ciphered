<script lang="ts">
  import { Tab, TabGroup } from "@skeletonlabs/skeleton";
  import { writable } from "svelte/store";
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
  }

  function decrypt() {}
</script>

<div class="flex flex-col gap-4 h-full">
  <TabGroup selected={variant} justify="justify-center">
    <Tab value="standard">Standard</Tab>
    <Tab value="extended">Extended</Tab>
    <Tab value="autokey">Auto-Key</Tab>
  </TabGroup>
  {#if $variant == "standard"}
    <div class="grow grid grid-rows-[1fr_auto_1fr] gap-6 h-full">
      <div class="h-full grid grid-rows-[auto_1fr] gap-4">
        <label class="input-label box-border grid grid-rows-[auto_1fr]">
          <span class="font-label">Key</span>
          <input type="text" bind:value={key} class="resize-none" />
        </label>
        <label class="input-label box-border grid grid-rows-[auto_1fr]">
          <span class="font-label">Input</span>
          <textarea bind:value={source} class="resize-none" />
        </label>
      </div>
      <div>
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
      <div class="input-label h-full box-border grid grid-rows-[auto_1fr]">
        <span class="font-label">Result</span>
        <div
          bind:this={resultContainer}
          class="bg-surface-700 rounded-md border-surface-500 border box-border p-2"
        >
          {result}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
</style>
