<script>

    import {timestamp_format, is_today, is_future, is_past} from './timestuff'

    import HistoryList from './HistoryList.svelte'
    import FancyButtonBar from './FancyButtonBar.svelte'
    import * as api from './apiclient'
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher()

    export let task = {}
    $: console.log(task)

    $: history = make_history(task)
    // $: console.log(history)

    $: last_event = task.events[0]
    let status = ''
    $: if (task.struck) {
        status = 'Struck'
    } else if (task.date_completed) {
        status = 'Completed'
    } else if (task.date_deactivated) {
        status = 'Deactivated'
    } else if (task.due && task.due < Date.now()/1000) {
        status = 'Overdue'
    } else if (task.events[task.events.legnth-1]?.kind === "deligate") {
        status = 'Delegated'
    } else if (is_past(task.date)) {
        status = 'Forgotten'
    } else if (is_future(task.date)) {
        status = "Future"
    } else {
        status = 'Active'
    }
    $: action_required = status === 'Forgotten' || status === 'Overdue'

    let button_options = {
        defer:{text:'➡️', confirm_text:"Defer?", alt:"Defer Task", name:"defer"},
        complete:{text:'✅', confirm_text:"Complete?", alt:"Complete Task", name:"complete"},
        reschedule:{text:'📅', confirm_text:"Reschedule?", alt:"Reschedule Task", name:"reschedule"},
        cancel:{text:'❌', confirm_text:"Cancel?", alt:"Cancel Task", name:"cancel"},
        addnote:{text:"📝", confirm_text:"Add Note?", alt:"Cancel Task", name:"addnote"},
        delegate:{text:"🙋", confirm_text:"Delegate?", alt:"Delegate Task", name:"delegate"},
        reactivate:{text:"♻️", confirm_text:"Reactivate?", alt:"Reactivate Task", name:"reactivate"},
        changedue:{text:"⏰", confirm_text:"Change Due?", alt:"Change Due Date", name:"changedue"},
    }

    let actionbuttons = [

    ]

    $: {
        if (status === "Deactivated" || status === "Completed") {
            actionbuttons = [button_options.reactivate]
        } else {
            actionbuttons = [
                button_options.complete,
                button_options.defer,
                button_options.reschedule,
                button_options.cancel,
                button_options.delegate,
                button_options.changedue,
                button_options.addnote,
            ]
        }
    }

    function make_history(thetask) {
        let newnotes = thetask.notes?.map((t)=>Object.assign({}, t, {type:'note'}))
        let newevents = thetask.events?.map((t)=>Object.assign({}, t, {type:'event'}))
        let combo = [...newnotes, ...newevents]
        combo.sort((a,b)=>b.date - a.date)
        return combo
    }

    function task_action_forward({detail:{name}}) {
        console.log(name)
        dispatch('task-action', {id:task.id, action:name})
    }

</script>

<div class="card {status}" class:action-required={action_required} class:has-due-date={task.due}>
    <ul>
        <li class="text">
            {task.text}
        </li>
        <li class="status">
            {status}
        </li>
        <li class="actions">
            <FancyButtonBar items={actionbuttons} on:confirm-click={task_action_forward}/>
        </li>
        {#each ['date', 'due', 'date_created', 'date_deactivated', 'date_completed'] as datename (datename)}
            <li class="{datename} dateitem" class:notime={!task[datename]}>
                {timestamp_format(task[datename])}
            </li>
        {/each}
        <!-- <li>
            {JSON.stringify(task)}
        </li> -->
        <li class="history">
            <HistoryList {history} />
        </li>
    </ul>
</div>

<style>
    .card.has-due-date {
        --primary-h-mod: -60;
    }
    .card.action-required {
        --primary-h-mod: 100;
        --primary-l: 20%;
    }
    .card.Deactivated {
        opacity: 0.5;
    }
    .card.Completed {
        opacity: 0.75;
    }
    .card {
        width: calc(100% - 20px);
        padding: 10px;
        margin: 10px 0;
        background: var(--gradient-subtle);
        /* background: hsl(var(--primary-h), var(--primary-s), var(--primary-l)); */
        border-radius: 20px;
        /* box-shadow:  3px 3px 10px #4b007c,
                    -3px -3px 10px #d43bff; */
        box-shadow:  var(--glow-shadow);
        border: 0.5px solid #FFF6;
    }
    .card ul {
        display: flex;
        flex-direction: column;
    }
    .card li {
        list-style: none;
    }
    .card li.text {
        border-radius: 15px;
        padding: 15px;
        border: 1px solid #FFF3;
        box-shadow: var(--card-part-shadow);
        z-index: 10;
    }
    .card li.status {
        z-index: 0;
        text-align: center;
        border: 1px solid #FFF3;
        border-bottom-right-radius: 15px;
        border-bottom-left-radius: 15px;
        border-top: none;
        margin-top: -11px;
        padding-top: 11px;
    }
    .card li.status::before {
        content: 'Status: '
    }
    .card li.actions {
        padding: 15px 0;
    }
    .card li.dateitem::before {
        display: inline-block;
        width: 60px;
        text-align: left;
        /* border-right: solid 1px hsl(var(--primary-h), var(--primary-s), calc(var(--primary-l) + 50%)); */
        margin-right: 0.7ch;
    }
    .card li.date::before {
        content: 'Date: '
    }
    .card li.due::before {
        content: 'Due: '
    }
    .card li.date_created::before {
        content: 'Created: '
    }
    .card li.date_completed::before {
        content: 'Completed: '
    }
    .card li.date_deactivated::before {
        content: 'Deactivated: '
    }
    .card li.notime {
        display: none;
    }

    .card li.history::before {
        content: "History";
        width: 100%;
        text-align: center;
        display: block;
        
    }
    .card li.history {

    }

</style>