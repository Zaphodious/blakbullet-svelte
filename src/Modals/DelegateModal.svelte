<script>
    import * as api from '../apiclient.js'
    export let current_user
    export let task_id
    export let done
    $: task = api.tasks[current_user][task_id]
    let person_name = ''
    function make_delegate() {
        api.task_act('delegate', current_user, task_id, person_name)
        done=true
    }
</script>

<div id="delegate-container">
    <div class="text">{task.text}</div>
    <!-- <label for="name">To</label> -->
    <input type="text" name="name" id="delegate-to" placeholder="To whome" bind:value={person_name}>
    <button on:click={make_delegate}>Delegate</button>
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