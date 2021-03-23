<script>
    import * as api from '../apiclient.js'
    export let current_user
    export let done
    let text = ""
    let due = ""

    async function make_new() {
        let newdue = null
        if (due) {
            newdue = Math.ceil(new Date(due).getTime()/1000)
            console.log(due, newdue)
        }
        await api.make_new_task(current_user, text, newdue)
        done = true
    }
</script>

<div id="container">
    <!-- <label for="name">To</label> -->
    <textarea name="text" id="text" cols="30" rows="7" bind:value={text}></textarea>
    <input type="datetime-local" name="due" id="due" bind:value={due}>
    <button on:click={make_new}>New Task</button>
</div>

<style>
    #container {
        width: 100%;
        display: flex;
        flex-direction: column;
    }
    .text::before {
        content: "Task Text: "
    }
    label {
        width: 100%;
        border-top: 1px solid hsl(var(--primary-h), var(--primary-s), calc(var(--primary-l) + 50%));
    }
    button {
        width: 100%;
    }
    input {
        width: 100%;
    }
</style>