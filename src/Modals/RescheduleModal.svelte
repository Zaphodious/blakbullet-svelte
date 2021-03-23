<script>
    import * as api from '../apiclient.js'
    export let current_user
    export let task_id
    export let done
    $: task = api.tasks[current_user][task_id]
    let newtime = ''
    function reschedule() {
        let time = null
        if (newtime) {
            time = Math.ceil(new Date(newtime).getTime()/1000)
            console.log(newtime, time)
            api.task_act('reschedule', current_user, task_id, time)
            done=true
        }
    }
</script>

<div id="delegate-container">
    <!-- <label for="name">To</label> -->
    <input type="datetime-local" name="newdate" id="newdate" placeholder="To whome" bind:value={newtime}>
    <button on:click={reschedule}>Reschedule</button>
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