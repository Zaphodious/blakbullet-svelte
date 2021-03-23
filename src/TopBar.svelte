<script>
    import {logout} from './apiclient.js'
    import FancyButton from './FancyButton.svelte'
    export let userlist
    export let current_user
    // console.log(JSON.stringify(userlist))

    function wrapped_logout() {
        logout(current_user)
        current_user = 'logout'
    }

</script>

<ul>
    <li>
            <FancyButton text="⚙️" />
    </li>
    <li>
        <h1>BlakBullet</h1>
    </li>
    <li>
        <div id="whoslogged">
            <select name="viewuser" id="viewuser" bind:value={current_user}>
                {#each userlist as user}
                <option value={user.id}>{user.username}</option>
                {/each}
                <option value="new">Add User</option>
            </select>
            <FancyButton text="Logoff" on:confirm-click={()=>wrapped_logout()}/>
        </div>
    </li>
</ul>

<style>
    h1 {
        font-size: 15px;
    }
    ul li {
        list-style: none;
    }
    ul {
        height: 40px;
        background: var(--gradient-chrome);
        box-shadow: 0px 0px 9px #0004;
        padding: 3px;
        border: 1px solid #0006;
        display: flex;
        flex-flow: row;
        justify-content: space-between;
        align-items: center;
        border-radius: 0 0 20px 20px;
    }
    select {
    }
    select:active {
        background: var(--button-click-back);
    }
</style>