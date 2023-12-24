<script>
  import { onMount } from "svelte";

    let message = "Svelte component"

    onMount(()=> {
        const spinner = document.querySelector(".spinner");
        if (spinner) spinner.style.display = "none";})
</script>

<div>{message}</div>