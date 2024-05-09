<script>
    import * as d3 from 'd3';
    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    export let data = [];
    export let selectedIndex = -1;
    let sliceGenerator = d3.pie().value(data => data.value);
    $: arcData = sliceGenerator(data);
    $: arcs = arcData.map(d => arcGenerator(d));
    let colors = d3.scaleOrdinal(d3.schemeTableau10);
    function toggleWedge (index, event) {
        if (!event.key || event.key === "Enter") {
            selectedIndex = selectedIndex === index ? -1 : index;
        }
}


</script>

<style>
    svg {
        max-width: 20em;
        margin-block: 2em;
        overflow: visible;
    }
    svg:has(path:hover, path:focus-visible) {
        path:not(:hover, :focus-visible) {
            opacity: 50%;
        }
    }
    path {
        transition: 300ms;
        cursor: pointer;
        outline: none;
    }
    li {
        display: flex;
        flex-direction: row;
    }

    ul {
        width: 100%
    }
    .pie-container {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .legend {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); /* Adjust '100px' to set the minimum width for each column */
        gap: 10px;
    }
    .legend .swatch {
        width: 20px;
        height: 20px;
        margin-right: 10px;
    }
    .selected {
        --color: oklch(40% 90% 0) !important;

        &:is(path) {
            fill: var(--color);
        }
    }
</style>

<div class="pie-container">
    <svg viewBox="-50 -50 100 100">
        {#each arcs as arc, index}
            <path d={arc} fill={ colors(index) }
                class:selected={selectedIndex === index}
                on:click={e => toggleWedge(index, e)} 
                on:keyup={e => toggleWedge(index, e)} />
        {/each}
        
    </svg>
    
    <ul class="legend">
        {#each data as d, index}
            <li style="--color: { colors(index) }; background color = var(--color)">
                <span class="swatch" style ="background-color: {colors(index)};"></span>
                {d.label} <em>({d.value})</em>
            </li>
        {/each}
    </ul>
</div>

