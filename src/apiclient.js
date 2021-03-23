// export let api_root = "https://api.bullet.blakwurm.com/"

import * as timestuff from './timestuff'

// const default_api_root = "https://bulletapi.blakwurm.com/"
export let api_root = "http://localhost:4242/"
// export let api_root = "http://192.168.0.69:4242/"


// The events that are on tasks can be of these particular
// kinds, and should be displayed and acted upon in certain
// ways depending on type
export const event_kinds = {
    activate:"activate",
    makenote:"makenote",
    delegate:"delegate",
    deffer:"deffer",
    cancel:"cancel",
    reschedule:"reschedule",
    strike:"strike",
    complete:"complete",
    reactivate:"reactivate",
    changedue:"changedue"
}

// Used to null a user object (and for reference)
let null_userdata = {
    token: null,
    token_type: null,
    refresh_token: null,
    usernme: null,
    id: null
}

// The users that are logged in to the app
export let users = {}

// The tasks in the app, organized by user. IE, tasks = {user_id: {task_id: task}}
export let tasks = {}

// Starts the API off
export async function init() {
    // Move users and tasks out of storage, if they exist
    users = JSON.parse(localStorage.getItem('users')) || users
    tasks = JSON.parse(localStorage.getItem('tasks')) || tasks
    // Fetch all the tasks for all logged in users. Later we will change this
    // so that it only fetches relevant tasks, but for now "all" is fine
    await Promise.all(Object.keys(users).map(id=>fetch_all_tasks(id)))
}

// System to let the client code know that things have changed,
// so that rendering etc can update
let watcher = {
    login_change:()=>undefined,
    tasks_change:()=>undefined
}

// Sets the watcher object. It must have the two functions
// in the dummy in order to work
export function set_watcher(newwatcher) {
    watcher = newwatcher
}

// Login function
export async function login(l_username, l_password) {
    // API requires formdata for login
    let formdata = new FormData()
    // Assign the formdata manually. We could take the form data
    // directy from a DOM element, but that violates levels
    formdata.append('username', l_username)
    formdata.append('password', l_password)
    // If we get any errors, then oops no login for you
    let user_data = {}
    try {
        // The API requires a POST request
        let res = await fetch(api_root+'token/', {
            method: 'POST',
            body: formdata
        })
        // Get the request, and destructure it. If there's any problem with the data,
        // we'll get an error and no login will happen
        let {token, refresh_token, token_type, status, message} = await res.json()
        // If the status code is 1, then the login was a success. If it was not, then
        // we don't want to continue
        // TODO: Update the API's error if the password is bad
        if (status != 1) { throw new Error('nope')}
        // Getting the User ID requires another trip back to the server. This
        // also serves as a test to make sure that the token works
        res = await fetch(`${api_root}me/`, {
                method: 'GET',
                headers: {
                    'Authorization': `${token_type} ${token}`
                }
            }
        )
        // The username will be in the payload under 'data'
        res = await res.json()
        let {username, id} = res.data
        // Even though we know the username, we need it to be returned from the /me call
        // to signify that it was good
        if (username) {
            // We package all of this information up
            user_data = {token, refresh_token, username, token_type, id}
            // Stash it in memory to be used by the app
            users[id] = user_data
            // Make sure that code that cares about object equality triggers
            users = Object.assign({}, users)
            // Stash all of the user stuff in  localstorage, in case the page gets unloaded at some point here
            localStorage.setItem('users', JSON.stringify(users))
            // Check to see if this user has an entry in tasks. They might already, if this is a re-login
            if (!tasks[id]) {
                // Same as with users, we make the container and then stash all of this in localstorage
                tasks[id] = {}
                localStorage.setItem('tasks', JSON.stringify(tasks))
            }
            // Let the watcher know that things have changed
            watcher.login_change(Math.random())
        }

        // If we find ourselves erroring out, we want to print the error, but we don't want everything to break
    } catch (thrown) {
        console.error(thrown)

    }
    console.log(user_data)
    // If the login was not successful, we still want to return the empty object
    return user_data
}

// Handles transofrming our raw query parameters into something useful
function encode_query_string(queryopts, base) {
    // Begin with the beginning of any query string
    let query = "?"
    // For each thing in the queryopts object, we convert it to a
    // URL-safe version and stick it's key's name on the front
    // Then we stick it on the end of the existing query string
    for (let [k,v] of Object.entries(queryopts)) {
        query = `${query}${k}=${encodeURIComponent(v)}&`
    }
    // If we haven't added anything to the query string, we don't want to
    // add just the ? to the URL
    if (query === "?") {
        return base
    } else {
        // If we've added things, however, it's just a concationation
        return base+query
    }
}

// This function takes in our params, and makes an authenticated
// requst to the API. Internal only.
async function makerequest(path, user_id, method="GET", query={}) {
    // The current user is important. As we can
    // have multiple users, we want to make sure that we're using the correct
    // authentication
    let current_user = users[user_id]
    // Build the object passed into the Fetch method, including
    // authentication parameters.
    let params = {
        method,
        headers: {
            'Authorization': `${current_user.token_type} ${current_user.token}`
        }
    }
    // Encode our query all nice and neat, then use it as the path
    path = encode_query_string(query, path)
    // Stash the result variable so that we have something to return to later
    let res = null
    // Seemingly reundant try block. Logging during debugging goes here,
    // so it stays in.
    try {
        // Good ol' fetch
        res = await fetch(`${api_root}${path}`, params)
    } catch (thrown) {
        throw thrown
    }
    // Check for an authentication error
    if (res.status === 401) {
        // Refresh the token so that the user doesn't have to log back in every
        // two hours
        let success = await refresh_token(user_id)
        // Did we refresh? refresh_token logs us out if not successful,
        // so we don't need to do anything else if not
        if (success) {
            // If refreshed, return we do a recursive call
            // We know that this will either terminate in
            // a failed call or a success
            return await makerequest(path, user_id, method, query)
        }
    }
    // The response is json encoded, and a status of 1 indicates success
    let responsebody = await res.json()
    if (responsebody.status === 1) {
        return responsebody.data
    } else {
        // An undefined if we fail, so that ?. protections work
        return undefined
    }
}

// If our token isn't valid, we might be able
// to refresh it via the refresh_token
// As we can have multiple users, we want
// to specify which user
async function refresh_token(user_id) {
    // Begin by getting the data for the specified user.
    // If this is being called, then a login request has
    // already failed, so we know that something's in
    // the user data object for this ID
    let user_data = users[user_id]
    // Don't you love destructuring? Get just the info we care about
    let {token, refresh_token} = user_data
    // the params for the fetch function
    let params = {
        method: 'POST',
        body: JSON.stringify({token, refresh_token})
    }
    // And the fetch request to the token refresh endpoint
    let res = await fetch(`${api_root}token/refresh/`, params)
    // For this, we use the HTTP status. A 200 means everything
    // is awesome
    if (res.status === 200) {
        // The thing will return a token and a refresh_token
        // (if the og token was good, it will just return that)
        // So, we can just stash them in the user's object as normal
        let b = await res.json()
        Object.assign(user_data, b)
        // After we modify the user, we want to make sure that
        // we save the results
        localStorage.setItem('users', JSON.stringify(users))
        console.log(users)
        return true
    } else {
        // If everything is not awesome, we want to logout immediately
        // so that the user can log themselves back in
        await logout()
    }
    // console.log(res)
}

function import_tasks(tlist) {
    // If the list is somehow falsy, it's probably 'undefined' as
    // returned by make_request. However, as we can't be sure *and*
    // any falsy value is an invalid value for this step,
    // we just return undefined
    if (!tlist) {
        return undefined
    }
    // If we ever accidentally pass in a task rather then a list,
    // we can handle it
    if (tlist.id) {
        tlist = [tlist]
    }
    // If we're using a library where object inequality
    // triggers a refresh (like Svelte), then we
    // want there to be a new object for said
    // refresh to be triggered
    let tasks_m = Object.assign({}, tasks)
    // For each task, we want to make sure that it goes into it's owner's
    // task bucket, as well as the all-tasks bucket
    tlist?.forEach(t=>tasks_m[t.owner_id][t.id] = t)
    // The task list is then replaced, and all is well.
    tasks = tasks_m
    // We also store the updated values to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks))
    // Let the watcher know that things have changed
    watcher.tasks_change(Math.random())
    // And the list is returned
    return tlist
}

// Fetches all the tasks available for the user
export async function fetch_all_tasks(user_id) {
    // Begins with getting the server-side list
    let serverlist = await makerequest('tasks', user_id)
    // import_tasks will import any tasks, and will handle
    // a failed request value
    return import_tasks(serverlist)
}

export async function fetch_active_tasks(user_id) {
    // The query for this is simple. The tasks that we're
    // after are logically active.
    let serverlist = await makerequest('tasks', user_id, 'GET', {active:true})
    // import_tasks will import any tasks, and will handle
    // a failed request value
    return import_tasks(serverlist)
} 

// Allows our client programmer to perform whatever server-supported
// query that they desire. The API server already does validation
// on the inputs, so we don't need to do that many here. If 
// the caller screws up, that's on them more or less
export async function fetch_tasks_by_query(user_id, query_obj) {
    // We make the request, passing in the query_obj
    let serverlist = await makerequest('tasks', user_id, 'GET', query_obj)
    // And we return the result of import_tasks, which handles
    // the result of a failed query gracefully
    return import_tasks(serverlist)
}


// Our log-out function
export function logout(user_id) {
    // For now, all we do to log out is delete the user data
    // record for the specified user. Later, an API method
    // could be used in order to actually terminate
    // the session
    delete users[user_id]
    localStorage.setItem('users', JSON.stringify(users))
    // Make sure that the watcher knows
    watcher.login_change(Math.random())
}

// Make an action on a task, by calling the server and returning
// the result
export function task_act(action, user_id, task_id, detail) {
    // Defer to generic function
    return big_act('task', action, user_id, task_id, detail)
}

// Generic action function, an anticipaton of doing actions on other
// types of records
async function big_act(thing_type, action, user_id, thing_id, detail) {
    // Construct the basic url path
    let stub_url = `${thing_type}/${thing_id}/action/${action}`
    // We don't want 'undefined' dangling off of the end, so
    // we only add in detail if it's there. As 0 is falsy, we
    // explicitely check for undefined
    if (detail != undefined) {
        stub_url += `/${detail}`
    }
    // Make the server call
    let t = await makerequest(stub_url, user_id, 'PUT')
    // Return the result of import task for API consistency
    return import_tasks(t)
}

// Makes a new task via server call
export async function make_new_task(user_id, text, due) {
    // The query is initially just the text
    let query = {text}
    // To avoid errors, we only add the due date if it exists.
    // This value shouldn't be 0, so if it is then we don't want
    // it anyway
    if (due) {
        query.due = due
    }
    // Make the server call
    let resp = await makerequest('task', user_id, 'POST', query)
    // Return the result of import task for API consistency
    return await import_tasks(resp)
}
