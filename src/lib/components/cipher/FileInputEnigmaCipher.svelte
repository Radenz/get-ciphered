<script lang="ts">
  import { FileDropzone } from "@skeletonlabs/skeleton";
  import { chunked } from "../../cipher/utils/char";
  import { EnigmaCipher } from "../../cipher/enigma";
  import { Action, saveText } from "../../utils/save";


  let alertMessage: string = "";
  let alertType = "warning";

  let source: Uint8Array;
  let rotor1: string;
  let rotor2: string;
  let rotor3: string;
  let position1: number = 0;
  let position2: number = 0;
  let position3: number = 0;
  let reflector: string;
  let plugboard: string = "";
  let result: Uint8Array = new Uint8Array([]);
  let resultString: string = "";
  let resultContainer: HTMLDivElement;
  let cipher: EnigmaCipher;

  let files: FileList;
  let fileName: string;
  let fileType: string;
  let action: Action;
  
  function encrypt() {
  if (!ensureKey()) return;
  if (!ensureInput()) return;
   cipher = new EnigmaCipher(
      rotor1,
      rotor2,
      rotor3,
      position1,
      position2,
      position3,
      plugboard,
      reflector
    );
    action == Action.ENCRYPT
    result = cipher.encryptBytes(source);
    resultString = String.fromCharCode(...result);
    compact();
  }

  function decrypt() {
    if (!ensureKey()) return;
    if (!ensureInput()) return;
    cipher = new EnigmaCipher(
      rotor1,
      rotor2,
      rotor3,
      position1,
      position2,
      position3,
      plugboard,
      reflector
    );
    action == Action.DECRYPT
    result = cipher.decryptBytes(source);
    resultString = String.fromCharCode(...result);
    compact();
  }

  async function onChange() {
    const file = files[0];
    fileName = file.name;
    fileType = file.type;
    source = new Uint8Array(await file.arrayBuffer());
  }

  function compact() {
    resultString = resultString.replaceAll(" ", "");
  }

  function chunk() {
    if (resultString.includes(" ")) return;
    const chunks = chunked(resultString, 5);
    resultString = chunks.join(" ");
  }

  function ensureInput() {
    clear();
    if (!source) {
      error("Input is empty!");
      return false;
    }

    return true;
  }


  function ensureKey() {
    clear();
    if (!rotor1 || !rotor2 || !rotor3 || !reflector) {
      error("Rotor or Reflector cannot be empty!");
      return false;
    }

    if(/[^1-9]/.test(position1.toString()) || /[^1-9]/.test(position2.toString()) || /[^1-9]/.test(position3.toString())){
      error("Position can only contain number!");
    }

    if(/[^A-Za-z]/.test(rotor1) || /[^A-Za-z]/.test(rotor2) || /[^A-Za-z]/.test(rotor3) || /[^A-Za-z]/.test(reflector)){
      error("Rotor and Reflector can only contain Alphabet letter!");
    }

    return true;
  }

  function warn(message: string) {
    alertMessage = message;
    alertType = "warning";
  }

  function error(message: string) {
    alertMessage = message;
    alertType = "error";
  }

  function clear() {
    alertMessage = "";
  }

  function save() {
    let name =
      action == Action.ENCRYPT
        ? `encrypted-${fileName}`
        : fileName.startsWith("encrypted-")
        ? fileName.replace("encrypted-", "")
        : `decrypted-${fileName}`;
    saveText(resultString, name);
  }

  $: fileLabel = fileName ? `File: ${fileName}` : "No file chosen";
</script>

<div class="grow grid grid-rows-[1fr_auto] gap-4 h-full overflow-hidden">
  <div class="grid grid-cols-[1fr_1fr_1fr] gap-6 overflow-hidden">
    <div class="grid grid-rows-[1fr_auto] gap-4">
      <FileDropzone
        bind:files
        height="h-full"
        notes="File should be a plaintext."
        on:change={onChange}
      />
      <h4>{fileLabel}</h4>
    </div>
    <div class="h-full">
      <h4>Setting EnigmaCipher</h4>
      <label class="input-label box-border  items-center gap-4 grow grid grid-cols-[0.3fr_1fr] mt-5 ">
        <h5 >Rotor 1</h5>
        <input type="text" bind:value={rotor1} class="h-8 text-input" />
      </label>
      <!-- </div> -->
      <label class="input-label box-border  grid grid-cols-[0.3fr_1fr] items-center gap-4 grow mt-5">
        <h5 >Rotor2</h5>
        <input type="text" bind:value={rotor2} class="h-8 text-input" />
      </label>
      <label class="input-label box-border  grid grid-cols-[0.3fr_1fr] items-center gap-4 grow mt-5">
        <h5 >Rotor3</h5>
        <input type="text" bind:value={rotor3} class="h-8 text-input " />
      </label>
      <label class="input-label box-border  grid grid-cols-[0.3fr_1fr] items-center gap-4 grow mt-5">
        <h5 >Position1</h5>
        <input type="text" bind:value={position1} class="h-8 text-input" />
      </label>
      <label class="input-label box-border  grid grid-cols-[0.3fr_1fr] items-center gap-4 grow mt-5">
        <h5 >Position2</h5>
        <input type="text" bind:value={position2} class="h-8 text-input" />
      </label>
      <label class="input-label box-border  grid grid-cols-[0.3fr_1fr] items-center gap-4 grow mt-5">
        <h5 >Position3</h5>
        <input type="text" bind:value={position3} class="h-8 text-input " />
      </label>
      <label class="input-label box-border grid grid-cols-[0.3fr_1fr] items-center gap-4 grow mt-5">
        <h5 >Reflector</h5>
        <input type="text" bind:value={reflector} class="h-8 text-input " />
      </label>
      <label class="input-label box-border grid grid-cols-[0.3fr_1fr] items-center gap-4 grow mt-5">
        <h5 >Plugboard</h5>
        <input type="text" bind:value={plugboard} class="h-8 text-input " />
      </label>
    </div>
    <div
      class="input-label h-full box-border grid grid-rows-[auto_1fr_auto] overflow-hidden"
    >
      <h4>Result</h4>
      <div
        class="bg-surface-700 rounded-md border-surface-500 border box-border p-2 overflow-y-scroll"
      >
        <p class="break-all">
          {resultString}
        </p>
      </div>
      {#if alertMessage}
        <div>
          {#if alertType == "warning"}
            <div class="alert variant-ghost-warning">{@html alertMessage}</div>
          {:else if alertType == "error"}
            <div class="alert variant-ghost-error">{@html alertMessage}</div>
          {/if}
        </div>
      {/if}
    </div>
  </div>
  <div class="grid grid-cols-[1fr_1fr_1fr] gap-6">
    <div class="flex items-center justify-between gap-6">
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
          on:click={save}
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
