<script>
    import Project from "$lib/Project.svelte";
    import projects from '$lib/projects.json';
</script>


<svelte:head>
	<title>My Resume</title>
</svelte:head>
<h1 style="width:85%; font-size: 8vh;">David Burke</h1>
<div style="width:40%;">
    <img src="images/photo.jpg" alt="David Burke Selfie">
</div>

<p>I am a 6-4 student in my first semester at MIT. I transfered from Tidewater 
    Community College in Virginia where I earned 2 associate degrees in Computer Science
    and Engineering. Prior to this I spent 10 years in the Navy as a Submarine Nuclear
    Electrical Engineering Technician and as an instructor. I have a wife and a 3-year-old
    son. 
</p>
{#await fetch("https://api.github.com/users/davidmburke") }
	<p>Loading...</p>
{:then response}
	{#await response.json()}
		<p>Decoding...</p>
	{:then data}
        <section>
            <h2>Github info:</h2>
            <div class="row">
                <p>   Followers: {data.followers}   </p>
                <div style=width:10%></div>
                <p>   Following: {data.following}   </p>
                <div style=width:10%></div>
                <p>   Public Repos: {data.public_repos}   </p>
            </div>
        </section>
	{:catch error}
		<p class="error">
			Something went wrong: {error.message}
		</p>
	{/await}
{:catch error}
	<p class="error">
		Something went wrong: {error.message}
	</p>
{/await}

<div class="projects">
    {#each projects.slice(0,3) as p}
        <Project info = { p } hLevel = 3 />
    {/each}
</div>