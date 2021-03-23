
export const seconds_in_a_day = 86400

export function timestamp_range_today() {
    // Begin by setting up the morning, one minute after the start
    // We use one minute after, to avoid a js from changing the 
    // date in a weird way if we set it to exactly midnight
    let morning = new Date()
    morning.setMinutes(1)
    morning.setHours(0)
    // Same thing for the night, setting it one minute away from midnight
    let night = new Date()
    night.setMinutes(59)
    night.setHours(23)
    // Return something that tells you exactly which value is which (and can be destructured
    // in a clear way without mucking up local scope)
    return {day_beginning: morning.getTime()/1000, day_end: night.getTime()/1000}
}

// Enumerated months, as an object to make it explicit
let months = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December',
}

// Enumerated weekdays, as an object and note a list
// to make it explicit
let weekdays = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednessday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
}

export function timestamp_date_format(timestamp) {
    // A null or 0 timestamp gives us the epoc time, which is
    // basically never going to be right
    if (!timestamp || timestamp === 0) {
        return ''
    }
    // Get the date from the timestamp, converted to milliseconds
    let d = new Date(timestamp * 1000)
    // For now, use the built-in date string function
    return d.toDateString()
}

// If we just want the time, and not the date, this will provide it
export function timestamp_time_format(timestamp) {
    // construct the date object
    let d = new Date(timestamp * 1000)
    // compose a string with the results
    return `${d.getHours()}:${d.getMinutes()}`
}

// Gives us both of the above functions, combined.
export function timestamp_format(timestamp) {
    // If the time is false (or explicitely 0) Date() will give us a bad value
    if (!timestamp || timestamp === 0) {
        return ''
    }
    // Compose the result and return
    return timestamp_date_format(timestamp) + ' at ' + timestamp_time_format(timestamp)
}

// Determines if a date is 'today' in local time
export function is_today(timestamp) {
    // Construct the date object for the stamp
    let d = new Date(timestamp*1000)
    // Construct an object that is set for today
    let today = new Date()
    // Compare the day, month, and year value and return result
    return d.getDate() === today.getDate() &&
           d.getMonth() === today.getMonth() &&
           d.getFullYear() === today.getFullYear()
}

// Determines if a time is not today, and in the past
export function is_past(timestamp) {
    // determine if the date is today
    let istoday = is_today(timestamp)
    // Get the timestamp for now
    let todaystamp = Date.now()/1000
    // If not today and today is greater then the stamp, it's in the past
    return !istoday && timestamp < todaystamp
}

export function is_future(timestamp) {
    // Determin if the date is today
    let istoday = is_today(timestamp)
    // Get the timestamp for now
    let todaystamp = Date.now()/1000
    // If not today and today is smaller then the stamp, it's in the future 
    return !istoday && timestamp > todaystamp
}