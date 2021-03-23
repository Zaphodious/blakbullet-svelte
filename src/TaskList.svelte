<script>
    import FancyButton from './FancyButton.svelte'
    import TaskCard from './TaskCard.svelte'
    import * as timestuff from './timestuff'


    export let tasks
    $: if (tasks === undefined) {tasks={}}
    let sortmethod = "date"
    export let filtermethod = "current"
    let method_filters = {
        'current': (task) => timestuff.is_today(task.date) && !task.date_completed && !task.date_deactivated,
        'future': (task) => timestuff.is_future(task.date) && !task.date_completed && !task.date_deactivated,
        'past': (task) => timestuff.is_past(task.date),
        'completed': (task) =>  task.date_completed,
        'deactivated': (task) => task.date_deactivated,
        'active': (task) => !task.date_deactivated && !task.date_completed,
    }
    $: filtered_tasks = Object.values(tasks).filter(method_filters[filtermethod])


</script>

    <ul>
        {#each filtered_tasks as task (task.id)}
            <li>
                <TaskCard {task} on:task-action />
            </li>
        {/each}
    </ul>

<style>
    ul {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex-basis: auto;
        margin-top: 50px;
        margin-bottom: 50px;
        overflow: scroll;
        height: 100%;
        width: 100%;
        padding: 0;
    }
    li {
        list-style: none;
        /* margin: 10px; */
        /* padding: 15px; */
        /* height: 4em; */
        width: calc(100% - 50px);
    }
</style>