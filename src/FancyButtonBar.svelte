<script>
    import App from './App.svelte'
    import FancyButton from './FancyButton.svelte'
    import FilterBar from './FilterBar.svelte'
    import TaskList from './TaskList.svelte'

    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let items = []
    $: items = items.map((n,i)=>{
        n.leftmost = i === 0
        n.rightmost = i === items.length-1
        return n
    })
    export let selector=false
    export let selected=""

    function confirm_it(ev) {
        if (selector) {
            selected = ev.detail.name
        } else {
            dispatch('confirm-click', ev.detail)
        }
    }

</script>

<ul>
    {#each items as item (item)}
    <li>
        <FancyButton {...item} selected={selector && item.name===selected ? true : false} on:confirm-click={confirm_it}></FancyButton>
    </li>
    {/each}
</ul>

<style>
    ul {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 0;
        margin: 0;
    }
    li {
        display: inline-block;
    }
    ul li > :global(.fancy-list-button){
        color: blue;
    }
</style>