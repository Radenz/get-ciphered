<script lang="ts">
  import { Tab, TabGroup } from "@skeletonlabs/skeleton";
  import { writable } from "svelte/store";
  // import FileInputPlayfairCipher from "./lib/components/cipher/FileInputPlayfairCipher.svelte";
  import TextInputPlayfairCipher from "./lib/components/cipher/TextInputAffineCipher.svelte";
  // import {  } from "./lib/cipher/playfair";

  let input = writable("text");
  const component = {
    text: TextInputPlayfairCipher,
    // file: FileInputPlayfairCipher,
  };
</script>

<div class="flex flex-col gap-4 h-full">
  <TabGroup selected={input} justify="justify-center">
    <Tab value="text">Text Input</Tab>
    <Tab value="file">File Input</Tab>
  </TabGroup>
  <svelte:component this={component[$input]} />
</div>
