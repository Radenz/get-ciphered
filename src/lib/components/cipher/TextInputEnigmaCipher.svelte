<script lang="ts">
  import { EnigmaCipher } from "../../cipher/enigma";
  import { chunked } from "../../cipher/utils/char";
  import { saveText } from "../../utils/save";

  let source: string;
  let rotor1: string;
  let rotor2: string;
  let rotor3: string;
  let position1: number = 0;
  let position2: number = 0;
  let position3: number = 0;
  let reflector: string;
  let plugboard:string = "";
  let result: string = "";
  let resultContainer: HTMLDivElement;
  let cipher: EnigmaCipher;

  function encrypt() {
    // cipher = new EnigmaCipher("EKMFLGDQVZNTOWYHXUSPAIBRCJ", "AJDKSIRUXBLHWTMCQGZNPYFVOE", "BDFHJLCPRTXVZNYEIWGAKMUSQO", 0, 0,0, "AB","YRUHQSLDPXNGOKMIEBFZCWVJAT");
    cipher = new EnigmaCipher(rotor1, rotor2, rotor3,position1,position2,position3, plugboard ,reflector);

    result = cipher.encrypt(source);
    compact();
  }

  function decrypt() {
    // cipher = new EnigmaCipher("EKMFLGDQVZNTOWYHXUSPAIBRCJ", "AJDKSIRUXBLHWTMCQGZNPYFVOE", "BDFHJLCPRTXVZNYEIWGAKMUSQO", 0, 0,0, "AB","YRUHQSLDPXNGOKMIEBFZCWVJAT");
    cipher = new EnigmaCipher(rotor1, rotor2, rotor3,position1,position2,position3, plugboard ,reflector);
    
    result = cipher.decrypt(source);
    compact();
  }

  function compact() {
    result = result.replaceAll(" ", "");
  }

  function chunk() {
    const chunks = chunked(result, 5);
    result = chunks.join(" ");
  }
</script>

<div class="grow grid grid-rows-[1fr_auto] gap-4 h-full">
  <div class="grid grid-cols-[1fr_1fr_1fr] gap-6">
    <div class="h-full">
      <label class="input-label box-border grid grid-rows-[auto_1fr] h-full">
        <h4>Input</h4>
        <textarea bind:value={source} class="resize-none" />
      </label>
    </div>
    <div class="h-full">
     <h4>Key</h4>
      <label class="input-label box-border flex items-center gap-4 grow mt-5">
        <h5 class =mr-2>Rotor1</h5>
        <input type="text" bind:value={rotor1} class="h-8 text-input" />
      </label>
      <label class="input-label box-border flex items-center gap-4 grow mt-5">
        <h5 class ="mr-2">Rotor2</h5>
        <input type="text" bind:value={rotor2} class="h-8 text-input" />
      </label>
      <label class="input-label box-border flex items-center gap-4 grow mt-5">
        <h5 class="mr-2">Rotor3</h5>
        <input type="text" bind:value={rotor3} class="h-8 text-input " />
      </label>
      <label class="input-label box-border flex items-center gap-4 grow mt-5">
        <h5 class =mr-2>Position1</h5>
        <input type="text" bind:value={position1} class="h-8 text-input" />
      </label>
      <label class="input-label box-border flex items-center gap-4 grow mt-5">
        <h5 class ="mr-2">Position2</h5>
        <input type="text" bind:value={position2} class="h-8 text-input" />
      </label>
      <label class="input-label box-border flex items-center gap-4 grow mt-5">
        <h5 class="mr-2">Position3</h5>
        <input type="text" bind:value={position3} class="h-8 text-input " />
      </label>
      <label class="input-label box-border flex items-center gap-4 grow mt-5">
        <h5 class="mr-2">Reflector</h5>
        <input type="text" bind:value={reflector} class="h-8 text-input " />
      </label>
      <label class="input-label box-border flex items-center gap-4 grow mt-5">
        <h5 class="mr-2">Plugboard</h5>
        <input type="text" bind:value={plugboard} class="h-8 text-input " />
      </label>
    </div>
    <div class="input-label h-full box-border grid grid-rows-[auto_1fr]">
      <h4>Result</h4>
      <div
        bind:this={resultContainer}
        class="bg-surface-700 rounded-md border-surface-500 border box-border p-2"
      >
        <p class="break-all">
        {result}
        </p>
      </div>
    </div>
  </div>
  <div class="grid grid-cols-[1fr_1fr_1fr] gap-6">
    <div class="flex items-center justify-between gap-6">
      <!-- <label class="input-label box-border flex items-center gap-4 grow">
        <h4>Keyphrase</h4>
        <input type="text" bind:value={key} class="h-8 text-input" />
      </label> -->
      <div class="flex gap-4">
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
    </div>
    <div class="flex justify-between items-center">
      <div class="flex gap-4 items-center">
        <h4>Format:</h4>
        <button
          class="btn btn-sm variant-filled-primary font-label font-semibold"
          on:click={compact}
        >
          Compact
        </button>
        <button
          class="btn btn-sm variant-filled-primary font-label font-semibold"
          on:click={chunk}
        >
          Chunked
        </button>
      </div>
    </div>
    <div>
        <button
          class="btn btn-sm variant-filled-primary font-label font-semibold"
          on:click={() => {
            saveText(result, "encrypted.txt");
          }}
        >
          Download
        </button>
      </div>
  </div>
</div>

<style>
  .text-input {
    margin-top: 0 !important;
  }
</style>
