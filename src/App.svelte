<script lang="ts">
  import { AppRail, AppRailTile } from "@skeletonlabs/skeleton";
  import { writable } from "svelte/store";
  import { AffineCipher } from "./lib/cipher/affine";
  import { HillCipher } from "./lib/cipher/hill";
  import { PlayfairCipher } from "./lib/cipher/playfair";
  import { ModulusMatrix } from "./lib/cipher/utils/math";
  import { VigenereCipher } from "./lib/cipher/vigenere";
  import AffineLabel from "./lib/components/labels/AffineLabel.svelte";
  import HillLabel from "./lib/components/labels/HillLabel.svelte";
  import PlayfairLabel from "./lib/components/labels/PlayfairLabel.svelte";
  import VigenereLabel from "./lib/components/labels/VigenereLabel.svelte";
  import VigenerePage from "./VigenerePage.svelte";

  let source: string;
  let encrypted: string;
  let key: string;
  let key2: string;
  let resultContainer: HTMLParagraphElement;
  let resultContainer2: HTMLParagraphElement;

  let file: HTMLInputElement;

  function encrypt() {
    // TODO: check key validity
    const cipher = new PlayfairCipher(key);
    // cipher.setKey(key);
    const res = cipher.encrypt(source);
    resultContainer.innerText = res;
  }

  function decrypt() {
    // TODO: check key validity
    const cipher = new PlayfairCipher(key2);
    // cipher.setKey(key2);
    const res = cipher.decrypt(encrypted);
    resultContainer2.innerText = res;
  }

  let flavorValue;

  async function display(f: File) {
    const buffer = await f.arrayBuffer();
    console.log(buffer);

    for (const byte of new Uint8Array(buffer.slice(0, 10))) {
      console.log(byte);
    }
  }

  /**
   * @Test
    fun testEncrypt() {
        val cipher = AffineCipher(7, 10)
        assertEquals("CZOLNE", cipher.encrypt("kripto"))
    }

    @Test
    fun testDecrypt() {
        val cipher = AffineCipher(7, 10)
        assertEquals("KRIPTO", cipher.decrypt("CZOLNE"))
    }

   */

  function a() {
    const matrix = new ModulusMatrix(3, 3);
    matrix.set(0, 0, 17);
    matrix.set(0, 1, 17);
    matrix.set(0, 2, 5);
    matrix.set(1, 0, 21);
    matrix.set(1, 1, 18);
    matrix.set(1, 2, 21);
    matrix.set(2, 0, 2);
    matrix.set(2, 1, 2);
    matrix.set(2, 2, 19);

    const cipher = new HillCipher(matrix);
  }

  a();

  const storeValue = writable("vigenere");
</script>

<!-- <main> -->
<!-- <AppBar>
    <svelte:fragment slot="lead">(lead)</svelte:fragment>
    (center)
    <svelte:fragment slot="trail">(trail)</svelte:fragment>
  </AppBar>
  <RangeSlider value={50} max={100} step={5} ticked>Label</RangeSlider>
  <Avatar src="https://i.pravatar.cc/" />
  <h2>Playfair</h2>
  <div>
    <input type="text" bind:value={source} />
    <input type="text" bind:value={key} />
    <button on:click={encrypt}>ENCRYPT!</button>
    <p bind:this={resultContainer} />
  </div>

  <div>
    <input type="text" bind:value={encrypted} />
    <input type="text" bind:value={key2} />
    <button on:click={decrypt}>DECRYPT!</button>
    <p bind:this={resultContainer2} />
  </div> -->

<!-- </main> -->
<!-- <h2>Hello World</h2>
<label class="input-label">
  <span>Flavors</span>
  <select name="flavors" id="flavors" bind:value={flavorValue}>
    <option value="chocolate">Chocolate</option>
    <option value="vanilla">Vanilla</option>
    <option value="strawberry">Strawberry</option>
  </select>
</label> -->

<div class="overflow-hidden grid grid-cols-[auto_1fr]">
  <AppRail class="h-full" selected={storeValue}>
    <svelte:fragment slot="lead">(lead)</svelte:fragment>
    <!-- (AppRailTiles Here) -->
    <AppRailTile value="vigenere"><VigenereLabel /></AppRailTile>
    <AppRailTile value="playfair"><PlayfairLabel /></AppRailTile>
    <AppRailTile value="hill"><HillLabel /></AppRailTile>
    <AppRailTile value="affine"><AffineLabel /></AppRailTile>
    <svelte:fragment slot="trail">(trail)</svelte:fragment>
  </AppRail>

  <div class="w-full h-screen p-12">
    <div class="card w-full h-full box-border shadow-md p-4">
      {#if $storeValue == "vigenere"}
        <VigenerePage />
      {/if}
    </div>
  </div>
</div>

<style>
</style>
