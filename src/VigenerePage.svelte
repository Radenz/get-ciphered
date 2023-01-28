<script lang="ts">
  import { Tab, TabGroup } from "@skeletonlabs/skeleton";
  import { writable } from "svelte/store";
  import { VigenereCipher } from "./lib/cipher/vigenere";
  import FileInputVigenereCipher from "./lib/components/cipher/FileInputVigenereCipher.svelte";
  import TextInputVigenereCipher from "./lib/components/cipher/TextInputVigenereCipher.svelte";

  let variant = writable("text-standard");
  const ciphers: { [key: string]: VigenereCipher } = {
    standard: VigenereCipher.standard(""),
    extended: VigenereCipher.extended(""),
    autokey: VigenereCipher.autoKey(""),
  };

  $: cipher = ciphers[$variant.replace("text-", "").replace("file-", "")];
</script>

<div class="flex flex-col gap-4 h-full">
  <TabGroup selected={variant} justify="justify-center">
    <Tab value="text-standard">Standard - Text</Tab>
    <Tab value="file-standard">Standard - File</Tab>
    <Tab value="text-extended">Extended - Text</Tab>
    <Tab value="file-extended">Extended - File</Tab>
    <Tab value="text-autokey">Auto-Key - Text</Tab>
    <Tab value="file-autokey">Auto-Key - File</Tab>
  </TabGroup>

  {#if $variant.startsWith("text-")}
    <TextInputVigenereCipher
      {cipher}
      forBinary={$variant.endsWith("extended")}
    />
  {:else}
    <FileInputVigenereCipher
      {cipher}
      forBinary={$variant.endsWith("extended")}
    />
  {/if}
</div>
