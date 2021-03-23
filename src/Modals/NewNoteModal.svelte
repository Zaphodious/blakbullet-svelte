<script>
    import * as api from '../apiclient.js'
    export let current_user
    export let task_id
    export let done
    $: task = api.tasks[current_user][task_id]
    let text = ''
    $: console.log(text)
    function make_delegate() {
        if (text) {
            api.task_act('addnote', current_user, task_id, text)
            done=true
        }
    }
</script>

<div id="delegate-container">
    <!-- <label for="name">To</label> -->
    <textarea name="text" id="text" cols="30" rows="7" bind:value={text}></textarea>
    <button on:click={make_delegate}>Add Note</button>
</div>

<style>
    #delegate-container {
        width: 100%;
        display: flex;
        flex-direction: column;
    }
    .text {
        width: 100%;
        padding-bottom: 1em;
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