<main>
  <form on:submit={handleSettingsUpdate} >
    <div class="form-group">
      <label>Port </label>
      <input bind:value={port} placeholder="port" />
    </div>
    <br/>
    <button type="submit">
      Save
    </button>
  </form>
</main>

<script>
  let port = 4000;

  function handleSettingsUpdate(e) {
    e.preventDefault();
    if (window.wv_test) {
      console.log(window.wv_test({ port }));
    }
    console.log({ port });
  }
</script>
