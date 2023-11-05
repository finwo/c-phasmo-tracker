<main>
  <pre>
  Context_t: {ctx_str}
  </pre>
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
  let port    = 3000;

  let ctx_str = "Loading...";
  homedir().then(dir => ctx_str = dir);

  function handleSettingsUpdate(e) {
    e.preventDefault();
    if (window.wv_test) {
      console.log(window.wv_test({ port }));
    }
    console.log({ port });
  }
</script>
