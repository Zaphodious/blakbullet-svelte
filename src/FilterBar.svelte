<script>
    import FancyButton from './FancyButton.svelte'
    import FancyButtonBar from './FancyButtonBar.svelte'
    import {createEventDispatcher} from 'svelte'

    const dispatch = createEventDispatcher();

    export let filtermethod = "past"
    $: console.log(filtermethod)
    
    function filterclick(ev) {
        console.log(ev)
    }

    function addnew_handler() {
        dispatch('addnew')
    }
</script>

<div>
    <!-- <ul>
        <li><FancyButton text="Now" /></li>
        <li><FancyButton text="Then" active=true/></li>
        <li><FancyButton text="Past" /></li>
        <li><FancyButton text="Search" /></li>
    </ul> -->
    <FancyButtonBar on:confirm-click={filterclick} selector=true bind:selected={filtermethod} items={[
        {text:"📅", alt:"Current Tasks", name:"current", confirm:false},
        {text:"🔮", alt:"Future Tasks", name:"future", confirm:false},
        {text:"👻", alt:"Past Tasks", name:"past", confirm:false},
        {text:"✅", alt:"Completed Tasks", name:"completed", confirm:false},
        {text:"❌", alt:"Deactivated Tasks", name:"deactivated", confirm:false},
        {text:"☢️", alt:"Active Tasks", name:"active", confirm:false},
        {text:"🔎", alt:"Search All Tasks", name:"search", confirm:false},
    ]}/>
    <ul>
        <li><FancyButton text="Add +" on:confirm-click={addnew_handler}/></li>
    </ul>
</div>

<style>
    ul li {
        display: inline-block;
    }
    div {
        height: 100%;
        display: flex;
        flex-flow: row;
        justify-content: space-around;
        align-items: center;
        background: var(--gradient-chrome);
        box-shadow: 0 0 1px hsl(var(--primary-h), var(--primary-s), 30%);
        padding: 0 5px;
    }
</style>