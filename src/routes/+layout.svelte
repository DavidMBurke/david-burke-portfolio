<script>
    import {page} from '$app/stores';

    let pages = [
        {url: "./", title: "Home"},
        {url: "./projects", title: "Projects"},
        {url: "./contact", title: "Contact"},
        {url: "./resume", title: "Resume"}, 
        {url: "https://github.com/DavidMBurke", title: "GitHub"}
    ];

    let colorScheme = "light dark";

    let localStorage = globalThis.localStorage ?? {};

    if (localStorage.colorScheme) {
	    colorScheme = localStorage.colorScheme;
    }

    $: localStorage.colorScheme = colorScheme;

    let root = globalThis?.document?.documentElement;
    $: root?.style.setProperty("color-scheme", colorScheme);

</script>

<style>
    nav {
    --border-color: oklch(50% 10% 200 / 40%);
    margin-bottom: 2%;
    border-bottom-width: 2px;
    border-bottom-style: solid;
    border-bottom-color: var(--border-color);
    }

    nav a {
        text-decoration: none;
        height: 100%;
        flex: 1;
        color: inherit;
        text-align: center;
        padding: 0.5em;
        padding-bottom: 0;
    }

    nav a:hover {
        border-bottom-color: var(--color-accent);
        border-bottom-width: 4px;
        border-bottom-style: solid;
        background-color: oklch(from var(--color-accent) 95% 5% h)
    }

    label.color-scheme {
        position: absolute;
        top: 1rem;
        right: 1rem;
    }

</style>

<nav>
    {#each pages as p }
        <a 
            href={p.url} 
            class:current={ "." + $page.route.id === p.url }
            target={ p.url.startsWith("http") ? "_blank" : null }>
            {p.title}
        </a>
    {/each}
</nav>

<label class="color-scheme">
    Theme:
    <select bind:value={ colorScheme }>
        <option value="light dark">Auto</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
    </select>
</label>

<slot />