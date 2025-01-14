import { Hono } from 'hono';

type Bindings = {
	CASHE: KVNamespace;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', async (c) => {
	const username = 'toufikforyou';

	const repsCashe = await c.env.CASHE.get(username, 'json');

	if (repsCashe) {
		return c.json(repsCashe);
	}

	const resp = await fetch(`https://api.github.com/users/${username}/repos`, {
		headers: {
			'User-Agent': 'Cf Worker',
		},
	});

	const data = await resp.json();
	await c.env.CASHE.put(username, JSON.stringify(data));

	return c.json(resp);
});

export default app;
