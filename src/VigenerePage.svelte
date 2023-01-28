<script lang="ts">
  import { Tab, TabGroup } from "@skeletonlabs/skeleton";
  import { writable } from "svelte/store";
  import { VigenereCipher } from "./lib/cipher/vigenere";
  import VigenereCipherHUD from "./lib/components/cipher/VigenereCipher.svelte";

  let variant = writable("standard");
  const cipher = {
    standard: VigenereCipher.standard(""),
    extended: VigenereCipher.extended(""),
    autokey: VigenereCipher.autoKey(""),
  };
</script>

<div class="flex flex-col gap-4 h-full">
  <TabGroup selected={variant} justify="justify-center">
    <Tab value="standard">Standard</Tab>
    <Tab value="extended">Extended</Tab>
    <Tab value="autokey">Auto-Key</Tab>
  </TabGroup>
  <svelte:component this={VigenereCipherHUD} cipher={cipher[$variant]} />
</div>
