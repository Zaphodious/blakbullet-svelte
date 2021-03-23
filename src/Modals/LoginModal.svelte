<script>
    import {login} from '../apiclient.js'
    export let done = false
    export let current_user = null
    let username = ""
    let password = ""
    let error = ""

    async function do_login() {
        error = ''
        let userdata = await login(username, password)
        if (userdata.id) {
            done=true
            current_user = userdata.id
        } else {
            error = "Login failed"
        }
    }
</script>

<div>
    {#if error != ""}
        <div id="error">{error}</div>
    {/if}
    <form>
        <label for="username">Username:</label><input id="username" name="username" bind:value={username}>
        <label for="password">Password:</label><input id="password" name="password" type="password" bind:value={password}>
        <button on:click|preventDefault={do_login}>Login</button>
    </form>
</div>

<style>
    form {
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
    }
    input {
        width: 100%;

    }
    label {
        width: auto;
    }
    button {
        width: 100%;
    }
</style>