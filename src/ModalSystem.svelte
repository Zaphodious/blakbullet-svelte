<script>
    import LoginModal from './Modals/LoginModal.svelte'
    import TaskHistoryModal from './Modals/TaskHistoryModal.svelte'
    import DelegateModal from './Modals/DelegateModal.svelte'
    import AddNewModal from './Modals/AddNewModal.svelte'
    import RescheduleModal from './Modals/RescheduleModal.svelte'
    import ChangeDueModal from './Modals/ChangeDueModal.svelte'
    import NewNoteModal from './Modals/NewNoteModal.svelte'
    export let current_user = null
    export let task_id = null
    export let note_id = null
    export let event_id = null
    export let modal_name = ''
    let modals = {
        'login': {title: "Login As New User", component: LoginModal},
        'delegate_task': {title: "Delegate Task", component: DelegateModal},
        'addnew': {title: "Add New Task", component: AddNewModal},
        'reschedule': {title: "Reschedule Task", component: RescheduleModal},
        'changedue': {title: "Change Task Due Date", component: ChangeDueModal},
        'addnote': {title: "Add New Task", component: NewNoteModal},
    }
    $: current_modal = modals[modal_name]

    function hide_modal() {
        console.log('doing?')
        modal_name = ''
        done=false
    }
    let done = false
    $: if (done) {hide_modal()}
</script>

{#if modal_name != ''}
    <div id="modal_blur" on:click={hide_modal}></div>
    {task_id} {note_id} {event_id} {modal_name}
    <div id="modal">
        <div id="modal-top">
            <h3>{current_modal.title}</h3>
            <!-- <FancyButton text="x" confirm=false  on:confirm-click={hide_modal} /> -->
            <button on:click={hide_modal}>X</button>
        </div>
        <div id="modal-main">
            <svelte:component this={current_modal.component} {task_id} {note_id} {event_id} bind:done={done} bind:current_user={current_user}/>
        </div>
    </div>
{/if}

<style>
    #modal_blur {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        background: hsla(var(--primary-h), var(--primary-s), var(--primary-l), 0.5);
    }
    #modal {
        position: fixed;
        --modal-width: 300px;
        top: 15vh;
        bottom: 15vh;
        left: calc(50vw - calc(var(--modal-width) / 2));
        right: calc(50vw - calc(var(--modal-width) / 2));
        z-index: 2000;
        background: var(--gradient-subtle);
        border: 1px solid;
        border-color: hsl(var(--primary-h), var(--primary-s), 80%);
        box-shadow: var(--modal-shadow);
        border-radius: 5px;
    }
    @media only screen and (min-width: 650px) {
        #modal {
            --modal-width: 600px;
        }
    }
    #modal-top {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        border-color: inherit;
        border-bottom: inherit;
        height: 40px;
        padding: 0 5px;
    }
    #modal-top > button {
        width: 30px;
        height: 30px;
        border-radius: 30px;
    }
    #modal-top > * {
        display: inline-block;
    }
    #modal-main {
        width: calc(100% - 10px);
        height: calc(100% - 41px - 10px);
        padding: 0;
        overflow: scroll;
        box-shadow: var(--modal-main-shadow);
        padding: 5px;
    }
    
</style>