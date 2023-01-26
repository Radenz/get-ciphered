<script lang="ts">
  import { PlayfairCipher } from "./lib/cipher/playfair";
  import { VigenereCipher } from "./lib/cipher/vigenere";

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

  async function display(f: File) {
    const buffer = await f.arrayBuffer();
    console.log(buffer);

    for (const byte of new Uint8Array(buffer.slice(0, 10))) {
      console.log(byte);
    }
  }

  // function a() {
  //   const cipher = VigenereCipher.extended("B");
  //   const buffer = new Uint8Array([0, 15, 197, 255, 7, 2]);

  //   console.log(buffer);
  //   console.log("B".charCodeAt(0));
  //   console.log(cipher.encryptBytes(buffer));
  // }

  // a();
</script>

<main>
  <!-- <h2>Vigenere</h2>
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
  </div>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
