
<script>
    import Project from "$lib/Project.svelte";
    import projects from '$lib/projects.json';
</script>

<svelte:head>
    <title>My Projects</title>
</svelte:head>

<h1 style="width:85%; font-size: 8vh;">{projects.length} Projects</h1>
<div class="projects">
    {#each projects as p}
        <Project info = { p } />
    {/each}
</div>
