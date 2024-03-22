<script>
    export let info = {};
    export let hLevel = 2;
</script>

<style>
    .project {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(15em, 1fr));
    }
    .article {
        height: 40%;
        margin-bottom: 10%;
    }
    .head {
        height: 30%;
    }
    .body {
        font-size: smaller;
        height: 70%;
    }
</style>

<div class="project">
    <article>
        <div class="head">
            <svelte:element this={"h" + hLevel}>{ info.title }</svelte:element>
        </div>
        <div class="body">
            <img src={info.image} alt="">
            <p>{info.description}</p>
            <p>{info.year}</p>
        </div>
    </article>
</div>
