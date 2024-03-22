
<script>
    import Project from "$lib/Project.svelte";
    import Pie from '$lib/Pie.svelte';
    import projects from '$lib/projects.json';
    import * as d3 from 'd3';

    let filteredProjects;
    $: filteredProjects = projects.filter(project => {
        let values = Object.values(project).join("\n").toLowerCase();
        return values.includes(query.toLowerCase());
    });

    let rolledData = d3.rollups(projects, v => v.length, d => d.year);
    let pieData = rolledData.map(([year, count]) => {
	    return { value: count, label: year };
    });
    let query = "";
    let selectedYearIndex = -1;
    let selectedYear;
    let filteredByYear;
    $: filteredByYear = projects.filter(project => {
        if (query) {
            let values = Object.values(project).join("\n").toLowerCase();
            return values.includes(query.toLowerCase());
        }
        if (selectedYear) {
            return project.year === selectedYear;
        }
        return true;
    });
    $: console.log(filteredByYear);
    $: selectedYear = selectedYearIndex > -1 ? pieData[selectedYearIndex].label : null;

</script>


<svelte:head>
    <title>My Projects</title>
</svelte:head>

<Pie data={pieData} bind:selectedIndex={selectedYearIndex} />

<input type="search" bind:value={query}

       aria-label="Search projects" placeholder="🔍 Search projects…" />
<h1 style="width:85%; font-size: 8vh;">{projects.length} Projects</h1>
<div class="projects">
    {#each filteredByYear as p}
        <Project info = { p } />
    {/each}
</div>
