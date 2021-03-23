<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let active = false
    export let selected = false
    export let confirm = true
    export let confirm_text = "Sure?"
    export let text = "Act"
    export let name = text
    export let alt = text
    export let confirm_alt = confirm_text
    export let confirmtime = 1500
    export let rightmost = true
    export let leftmost = true
    export let action = function() {}
    let current_alt = alt
    let current_text = text
    let clicked = false
    let current_timeout = null

    function reset() {
        current_text = text
        current_alt = alt
        clicked = false
    }

    function clicker(event) {
        if (clicked || !confirm) { 
            reset()
            action()
            dispatch('confirm-click', {name,text});
            clearTimeout(current_timeout)
        } else {
            clicked = true
            current_text = confirm_text
            current_alt = confirm_alt
            current_timeout = setTimeout(reset, confirmtime);
        }
    }
</script>

<button title={current_alt} on:click={clicker} class="{selected ? 'selected': ''} {active ? 'active' : ''} {rightmost ? 'rightmost' : ''} {leftmost ? 'leftmost' : ''}">
    {current_text}
</button>

<style>
    button {
	    color: var(--text-color);
        border-radius: 0;
        padding: 3px 9px;
        margin: none;
        border-left: 1px solid;
        border-right: none;
        border-right-color: var(--deemph-border-color);
        border-left-color: var(--deemph-border-color);
        /* box-shadow: 3px 3px 10px hsl(calc(var(--primary-h) - 15), var(--primary-s), calc(var(--primary-l) + 20%)),
                    -3px -3px 10px hsl(calc(var(--primary-h) + 45), var(--primary-s), calc(var(--primary-l) + 15%)); */
    }
    button.rightmost {
        border-bottom-right-radius: 15px;
        border-top-right-radius: 15px;
        border-right: 1px outset;
        border-color: var(--main-border-color);
        border-left: none;
    }
    button.leftmost {
        border-bottom-left-radius: 15px;
        border-top-left-radius: 15px;
        border-left: 1px outset;
        border-color: var(--main-border-color);
    }

</style>