<script>
	import TopBar from './TopBar.svelte'
	import TaskList from './TaskList.svelte'
	import FilterBar from './FilterBar.svelte'
	import ModalSystem from './ModalSystem.svelte'
	import * as api from './apiclient.js'
import FancyButton from './FancyButton.svelte'
import FancyButtonBar from './FancyButtonBar.svelte'


	api.init()

	let current_user = Object.keys(api.users)[0]
	let userlist = Object.values(api.users)
	console.log(userlist)

	$: tasks = api.tasks[current_user]
	$: console.log(current_user)

	let filtermethod = 'current'
	$: console.log('filter method', filtermethod)

	let modal_info = {modal_name: 'login'}

	let current_modal = ''

	$: if (current_user === 'new') {current_modal = 'login'}
	$: if (current_user === undefined) {current_modal = 'login'}
	$: if (current_user === 'logout') {current_user = userlist[userlist.length-1]?.id}

	function setnew() {
			userlist = Object.values(api.users)
			tasks = api.tasks[current_user]
			console.log(tasks)
	}

	let watcher = {
		login_change:setnew,
		tasks_change:setnew
	}
	api.set_watcher(watcher)

	const action_handlers = {
		'defer':(id)=>api.task_act('defer', current_user, id),
		'complete':(id)=>api.task_act('complete', current_user, id),
		'reactivate':(id)=>api.task_act('reactivate', current_user, id),
		'cancel':(id)=>api.task_act('cancel', current_user, id),
		'strike':(id)=>api.task_act('strike', current_user, id),
		'unstrike':(id)=>api.task_act('unstrike', current_user, id),
		'delegate':(id)=>{modal_info={modal_name:'delegate_task', task_id:id, current_user}},
		'reschedule':(id)=>{modal_info={modal_name:'reschedule', task_id:id, current_user}},
		'changedue':(id)=>{modal_info={modal_name:'changedue', task_id:id, current_user}},
		'addnote':(id)=>{modal_info={modal_name:'addnote', task_id:id, current_user}},
	}

	function on_task_action({detail:{id,action}}) {
		console.log(id,action)
		action_handlers[action](id)
	}

	function addnew_handler() {
		modal_info={modal_name:'addnew', current_user}
	}

</script>

<header>
	<TopBar {userlist} bind:current_user={current_user}/>
</header>
<main>
	<TaskList {tasks} on:task-action={on_task_action} bind:filtermethod={filtermethod}/>
</main>
<footer>
	<FilterBar on:addnew={addnew_handler} bind:filtermethod={filtermethod} />
</footer>


<ModalSystem {...modal_info} bind:current_user={current_user} bind:modal_name={current_modal}/>

<style>
</style>