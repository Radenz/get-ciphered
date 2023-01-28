<script lang="ts">
  import { AppRail, AppRailTile } from "@skeletonlabs/skeleton";
  import { writable } from "svelte/store";
  import AffinePage from "./AffinePage.svelte";
  import HillPage from "./HillPage.svelte";
  import AffineLabel from "./lib/components/labels/AffineLabel.svelte";
  import HillLabel from "./lib/components/labels/HillLabel.svelte";
  import PlayfairLabel from "./lib/components/labels/PlayfairLabel.svelte";
  import VigenereLabel from "./lib/components/labels/VigenereLabel.svelte";
  import EnigmaLabel from "./lib/components/labels/EnigmaLabel.svelte";
  import PlayfairPage from "./PlayfairPage.svelte";
  import VigenerePage from "./VigenerePage.svelte";
  import EnigmaPage from "./EnigmaPage.svelte";
  const cipher = writable("vigenere");
  const pages = {
    vigenere: VigenerePage,
    playfair: PlayfairPage,
    hill: HillPage,
    affine: AffinePage,
    enigma: EnigmaPage,
  };
</script>

<div class="overflow-hidden grid grid-cols-[auto_1fr]">
  <AppRail class="h-full" selected={cipher}>
    <svelte:fragment slot="lead"
      ><div class="flex items-center justify-center p-4">
        <svg
          width="36"
          height="36"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          ><path
            d="M5 4.63601C5 3.76031 5.24219 3.1054 5.64323 2.67357C6.03934 2.24705 6.64582 1.9783 7.5014 1.9783C8.35745 1.9783 8.96306 2.24652 9.35823 2.67208C9.75838 3.10299 10 3.75708 10 4.63325V5.99999H5V4.63601ZM4 5.99999V4.63601C4 3.58148 4.29339 2.65754 4.91049 1.99307C5.53252 1.32329 6.42675 0.978302 7.5014 0.978302C8.57583 0.978302 9.46952 1.32233 10.091 1.99162C10.7076 2.65557 11 3.57896 11 4.63325V5.99999H12C12.5523 5.99999 13 6.44771 13 6.99999V13C13 13.5523 12.5523 14 12 14H3C2.44772 14 2 13.5523 2 13V6.99999C2 6.44771 2.44772 5.99999 3 5.99999H4ZM3 6.99999H12V13H3V6.99999Z"
            fill="currentColor"
            fill-rule="evenodd"
            clip-rule="evenodd"
          /></svg
        >
      </div></svelte:fragment
    >
    <AppRailTile value="vigenere"><VigenereLabel /></AppRailTile>
    <AppRailTile value="playfair"><PlayfairLabel /></AppRailTile>
    <AppRailTile value="hill"><HillLabel /></AppRailTile>
    <AppRailTile value="affine"><AffineLabel /></AppRailTile>
    <AppRailTile value="enigma"><EnigmaLabel /></AppRailTile>
    <svelte:fragment slot="trail"
      ><a
        href="https://github.com/Radenz/cipher"
        class="flex items-center justify-center p-4"
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          ><path
            d="M7.49933 0.25C3.49635 0.25 0.25 3.49593 0.25 7.50024C0.25 10.703 2.32715 13.4206 5.2081 14.3797C5.57084 14.446 5.70302 14.2222 5.70302 14.0299C5.70302 13.8576 5.69679 13.4019 5.69323 12.797C3.67661 13.235 3.25112 11.825 3.25112 11.825C2.92132 10.9874 2.44599 10.7644 2.44599 10.7644C1.78773 10.3149 2.49584 10.3238 2.49584 10.3238C3.22353 10.375 3.60629 11.0711 3.60629 11.0711C4.25298 12.1788 5.30335 11.8588 5.71638 11.6732C5.78225 11.205 5.96962 10.8854 6.17658 10.7043C4.56675 10.5209 2.87415 9.89918 2.87415 7.12104C2.87415 6.32925 3.15677 5.68257 3.62053 5.17563C3.54576 4.99226 3.29697 4.25521 3.69174 3.25691C3.69174 3.25691 4.30015 3.06196 5.68522 3.99973C6.26337 3.83906 6.8838 3.75895 7.50022 3.75583C8.1162 3.75895 8.73619 3.83906 9.31523 3.99973C10.6994 3.06196 11.3069 3.25691 11.3069 3.25691C11.7026 4.25521 11.4538 4.99226 11.3795 5.17563C11.8441 5.68257 12.1245 6.32925 12.1245 7.12104C12.1245 9.9063 10.4292 10.5192 8.81452 10.6985C9.07444 10.9224 9.30633 11.3648 9.30633 12.0413C9.30633 13.0102 9.29742 13.7922 9.29742 14.0299C9.29742 14.2239 9.42828 14.4496 9.79591 14.3788C12.6746 13.4179 14.75 10.7025 14.75 7.50024C14.75 3.49593 11.5036 0.25 7.49933 0.25Z"
            fill="currentColor"
            fill-rule="evenodd"
            clip-rule="evenodd"
          /></svg
        >
      </a></svelte:fragment
    >
  </AppRail>

  <div class="w-full h-screen p-12">
    <div class="card w-full h-full box-border shadow-md p-4">
      <svelte:component this={pages[$cipher]} />
    </div>
  </div>
</div>

<style>
</style>
