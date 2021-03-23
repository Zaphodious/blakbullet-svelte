import App from './App.svelte';
import * as api from './apiclient.js'

window.api = api

const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

export default app;