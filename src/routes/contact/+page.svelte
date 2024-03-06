<svelte:head>
	<title>Contact me</title>
</svelte:head>

<h1 style="width:85%; font-size: 8vh;">Contact</h1>
<form action="mailto: burkedm@mit.edu" method="post" enctype="text/plain">
    <div class="form-list">
        <div class="form-row">
            <label>Email: </label>
            <input name="email" type="email"/>
        </div>
        <div class="form-row">
            <label>Subject: </label>
            <input name="subject" />
        </div>
        <div class="form-row">
            <label>Message: </label>
            <textarea name="body"> </textarea>
        </div>
        <button>Submit</button>
    </div>
</form>