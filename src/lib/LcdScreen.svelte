<script lang="ts">
  export let paramName: string = '';
  export let value: string | number = '';
</script>

<div class="lcd-screen">
  {#if paramName}
    <div class="lcd-content">
      <div class="param-name">{paramName}</div>
      <div class="param-value">{value}</div>
    </div>
  {/if}
</div>

<style>
  .lcd-screen {
    position: absolute;
    width: 71px;
    height: 41px;
    top: 192px;
    left: 635px;
    border: 1px solid #333;
    background-color: #333;
    border-radius: 2px;
  }

  .lcd-content {
    color: #0f0;
    font-family: monospace;
    font-size: 10px;
    padding: 5px;
    text-align: center;
  }

  .param-name {
    font-weight: bold;
  }

  .param-value {
    margin-top: 2px;
  }
</style>
