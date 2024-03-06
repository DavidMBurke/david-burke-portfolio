<script>
    export let info = {};
    export let hLevel = 2;
    let p = info;
</script>

<style>
    .project {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(15em, 1fr));
    }
</style>

<div class="project">
    <article>
        <svelte:element this={"h" + hLevel}>{ p.title }</svelte:element>
        <img src={p.image} alt="">
        <p>{p.description}</p>
    </article>
</div>
