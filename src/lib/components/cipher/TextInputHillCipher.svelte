<script lang="ts">
  import { HillCipher } from "../../cipher/hill";
  import { chunked } from "../../cipher/utils/char";
  import { saveText } from "../../utils/save";
  import { ModulusMatrix } from "../../cipher/utils/math";

  export let cipher: HillCipher;

  let source: string;
  let result: string = "";
  let key: string;
  let keymatrix: ModulusMatrix;

  function createMatrixKey(){
    const arr = key.split(" ")
    const size = Math.sqrt(arr.length)
    let idx =0;
    keymatrix = new ModulusMatrix(size,size);
    for (let i = 0; i < size; i++){
      for(let j = 0; j < size; j++){
        keymatrix.set(i,j,Number(arr[idx]));
        idx++;
      }
    }

  }
  function encrypt() {
    createMatrixKey();
    console.log(keymatrix);
    cipher = new HillCipher(keymatrix);
    result = cipher.encrypt(source);
  }

  function decrypt() {
    createMatrixKey();
    cipher = new HillCipher(keymatrix);
    result = cipher.decrypt(source);
  }

  function compact() {
    result = result.replaceAll(" ", "");
  }

  function chunk() {
    if (result.includes(" ")) return;
    const chunks = chunked(result, 5);
    result = chunks.join(" ");
  }
</script>

<div class="grow grid grid-rows-[1fr_auto] gap-4 h-full">
  <div class="grid grid-cols-[1fr_1fr] gap-6">
    <div class="h-full">
      <label class="input-label box-border grid grid-rows-[auto_1fr] h-full">
        <h4>Input</h4>
        <textarea bind:value={source} class="resize-none" />
      </label>
    </div>
    <div class="input-label h-full box-border grid grid-rows-[auto_1fr]">
      <h4>Result</h4>
      <div
        class="bg-surface-700 rounded-md border-surface-500 border box-border p-2"
      >
        <p class="break-all">
        {result}
        </p>
      </div>
    </div>
  </div>
  <div class="grid grid-cols-[1fr_1fr] gap-6">
    <div class="flex items-center justify-between gap-6">
      <label class="input-label box-border flex items-center gap-4 grow">
        <h4>KeyMatrix</h4>
        <input type="text" bind:value={key} class="h-8 text-input" />
      </label>
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
</div>

<style>
  .text-input {
    margin-top: 0 !important;
  }
</style>
