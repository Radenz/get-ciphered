<script lang="ts">
  import { Tab, TabGroup } from "@skeletonlabs/skeleton";
  import { writable } from "svelte/store";
  import FileInputAffineCipher from "./lib/components/cipher/FileInputAffineCipher.svelte";
  import TextInputAffineCipher from "./lib/components/cipher/TextInputAffineCipher.svelte";
  // import {  } from "./lib/cipher/Affine";

  let input = writable("text");
  const component = {
    text: TextInputAffineCipher,
    file: FileInputAffineCipher,
  };
</script>

<div class="flex flex-col gap-4 h-full">
  <TabGroup selected={input} justify="justify-center">
    <Tab value="text">Text Input</Tab>
    <Tab value="file">File Input</Tab>
  </TabGroup>
  <svelte:component this={component[$input]} />
</div>
