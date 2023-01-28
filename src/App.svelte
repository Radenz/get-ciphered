<script lang="ts">
  import { AppRail, AppRailTile } from "@skeletonlabs/skeleton";
  import { writable } from "svelte/store";
  import AffinePage from "./AffinePage.svelte";
  import HillPage from "./HillPage.svelte";
  import AffineLabel from "./lib/components/labels/AffineLabel.svelte";
  import HillLabel from "./lib/components/labels/HillLabel.svelte";
  import PlayfairLabel from "./lib/components/labels/PlayfairLabel.svelte";
  import VigenereLabel from "./lib/components/labels/VigenereLabel.svelte";
  import PlayfairPage from "./PlayfairPage.svelte";
  import VigenerePage from "./VigenerePage.svelte";

  const cipher = writable("vigenere");
  const pages = {
    vigenere: VigenerePage,
    playfair: PlayfairPage,
    hill: HillPage,
    affine: AffinePage,
  };
</script>

<div class="overflow-hidden grid grid-cols-[auto_1fr]">
  <AppRail class="h-full" selected={cipher}>
    <svelte:fragment slot="lead">(lead)</svelte:fragment>
    <AppRailTile value="vigenere"><VigenereLabel /></AppRailTile>
    <AppRailTile value="playfair"><PlayfairLabel /></AppRailTile>
    <AppRailTile value="hill"><HillLabel /></AppRailTile>
    <AppRailTile value="affine"><AffineLabel /></AppRailTile>
    <svelte:fragment slot="trail">(trail)</svelte:fragment>
  </AppRail>

  <div class="w-full h-screen p-12">
    <div class="card w-full h-full box-border shadow-md p-4">
      <svelte:component this={pages[$cipher]} />
    </div>
  </div>
</div>

<style>
</style>
