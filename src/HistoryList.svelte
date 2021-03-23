<script>
import { timestamp_format } from "./timestuff";

    export let history = []
    let expand = false
    let hide_events = true
</script>

<button class="hideit" on:click={()=>{hide_events=!hide_events}}>{hide_events ? 'Show Events' : 'Hide Events'}</button>
<ul class:expanded={expand} class="mainlist">
    {#each history as item (item.type + item.id)}
        {#if !hide_events || item.type === 'note'}
        <li>
            <ul class='{item.type} {item.kind} history-item'>
                <li class="type">
                    {item.type}
                </li>
                <li class='kind'>
                    {item.kind}
                </li>
                <li class="date">
                    {timestamp_format(item.date)}
                </li>
                <li class='date-to'>
                    {timestamp_format(item.date_to)}
                </li>
                <li class='subtext'>
                    {item.text}
                </li>
                <li class='meta'>
                    {item.meta}
                </li>
            </ul>
        </li>
        {/if}
    {/each}

</ul>
<button class="expando" on:click={()=>{expand=!expand}}>{expand ? 'Contract' : 'Expand'}</button>

<style>
    li {
        list-style: none;
    }
    button {
        width: 100%;
    }
    .expando {
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
    }
    .hideit {
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }
    .mainlist {
        padding: 5px;
        max-height: 100px;
        overflow: hidden;
        box-shadow: var(--card-part-shadow);
        border: 1px solid #FFF3;
    }
    .history-item {
        background: var(--gradient-subtle);
        display: grid;
        grid-template-rows:auto;
        grid-template-columns: 2em auto;
        margin: 10px;
        margin-bottom: 10px;
        padding: 5px;
        box-shadow: 0px 0px 3px hsl(calc(var(--primary-h) - 20 + var(--primary-h-mod)), var(--primary-s), 45%),
        0 0 3px hsl(calc(var(--primary-h) + 20), var(--primary-s), 15%);
        /* text-shadow: 0 0 4px hsl((var(--primary-h)), var(--primary-s), var(--primary-l)); */
        border: 1px outset hsl(var(--primary-h), 50%, 50%);
        border-radius: 5px;
        white-space: pre-line;
    }
    .event {
        /* --primary-l: 20%; */
        grid-template-areas: 
        'type kind'
        'type date'
        'type dato'
        'type meta'
        ;
    }
    .note {
        /* --primary-l: 20%; */
        /* --primary-h: 50; */
        --primary-h-mod: 120;
        grid-template-areas: 
        'type date'
        'type sbtx'
        ;
        /* color: black; */
        mix-blend-mode:lighten;
    }
    @media only screen and (max-width: 500px) {

    }
    .mainlist.expanded {
        max-height: inherit;
    }
    .type {
        grid-area: type;
        height: 100%;
        width: 1em;
        writing-mode: vertical-lr;
        text-align: center;
        /* transform: rotate(180); */
    }
    /* .type::before {
        content: 'Type: '
    } */
    .date {
        grid-area: date;
    }
    /* .date::before {
        display: inline-block;
        content: 'Date: ';
        width: 40px;
    } */
    .kind {
        grid-area: kind;
        /* text-align: center; */
    }
    .kind::before {
        /* content: 'Kind: ' */
    }
    .kind {
        text-transform: capitalize;
    }
    .note .kind {
        display: none;
    }
    .meta {
        display: none;
        grid-area: meta;
    }
    .delegate .meta {
        display: inline-block;
    }
    .meta::before {
        content: 'Meta: '
    }
    .delegate .meta::before {
        content: 'Delegated To: '
    }
    .note .meta {
        display: none;
    }
    .date-to {
        display: none;
        grid-area: dato;
    }
    :is(.defer, .reschedule, .changedue) .date-to {
        display: inline-block;
    }
    .date-to::before {
        display: inline-block;
        content: 'To: ';
        /* width: 40px; */
    }
    .note .date-to {
        display: none;
    }
    .subtext {
        grid-area: sbtx;
    }
    .subtext::before {
        /* content: 'Text: ';
        display: block; */
    }
    .event .subtext {
        display: none;
        white-space: pre-line;
    }
    .note .subtext {
        display: inline-block;
    }
</style>