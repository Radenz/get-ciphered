<script lang="ts">
  import { Tab, TabGroup } from "@skeletonlabs/skeleton";
  import { writable } from "svelte/store";
  import FileInputEnigmaCipher from "./lib/components/cipher/FileInputEnigmaCipher.svelte";
  import TextInputEnigmaCipher from "./lib/components/cipher/TextInputEnigmaCipher.svelte";
  // import {  } from "./lib/cipher/playfair";

  let input = writable("text");
  const component = {
    text: TextInputEnigmaCipher,
    file: FileInputEnigmaCipher,
  };
</script>

<div class="flex flex-col gap-4 h-full">
  <TabGroup selected={input} justify="justify-center">
    <Tab value="text">Text Input</Tab>
    <Tab value="file">File Input</Tab>
  </TabGroup>
  <svelte:component this={component[$input]} />
</div>
