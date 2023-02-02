<script lang="ts">
  export let size: number;

  function zeros(size: number): number[][] {
    let rows = size;
    const arr = [];
    while (rows--) {
      const row = [];
      let cols = size;
      while (cols--) row.push(0);
      arr.push(row);
    }
    return arr;
  }

  export let matrix = zeros(size);

  function onInput(event: Event, rowIndex: number, colIndex: number) {
    const target = event.target as HTMLInputElement;
    const newValue = (event.target as HTMLInputElement).value;
    if (!/^[0-9]*$/.test(newValue)) {
      target.value = newValue.replaceAll(/[^0-9]/g, "");
    }
    matrix[rowIndex][colIndex] = +target.value;
  }

  $: {
    if (matrix.length < size) {
      while (matrix.length < size) {
        matrix.push([]);
      }
      for (let i = 0; i < matrix.length; i++) {
        while (matrix[i].length < size) {
          matrix[i].push(0);
        }
      }
    }

    if (matrix.length > size) {
      while (matrix.length > size) {
        matrix.pop();
      }
      for (let i = 0; i < matrix.length; i++) {
        while (matrix[i].length > size) {
          matrix[i].pop();
        }
      }
    }

    // Correctly construct new or destroy existing UI elements
    matrix = matrix;
  }
</script>

<div class="matrix grid gap-1" style:--size={size}>
  {#each matrix as row, rowIndex}
    {#each row as cell, colIndex}
      <input
        type="text"
        bind:value={matrix[rowIndex][colIndex]}
        on:input={(e) => onInput(e, rowIndex, colIndex)}
        class="h-8 text-input"
      />
    {/each}
  {/each}
</div>

<style>
  .text-input {
    margin-top: 0 !important;
  }

  .matrix {
    grid-template-rows: repeat(var(--size), 1fr);
    grid-template-columns: repeat(var(--size), 1fr);
  }
</style>
