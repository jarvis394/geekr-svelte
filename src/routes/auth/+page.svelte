<script lang="ts">
	import { Input } from '$lib/components/ui/input'
	import { Button } from '$lib/components/ui/button'
	import enhance from 'svelte-captcha-enhance'
	import { Label } from '$lib/components/ui/label'
	import { Header } from '$lib/components/header'
</script>

<svelte:head>
	<script src="https://js.hcaptcha.com/1/api.js?render=onload" async defer></script>
</svelte:head>

<Header title="Вход" />
<form class="mx-auto flex max-w-sm flex-col gap-4 p-4" method="post">
	<div class="flex flex-col gap-3">
		<Label for="email">Электропочта</Label>
		<Input id="email" type="text" name="email" placeholder="me@example.com" required />
	</div>
	<div class="flex flex-col gap-3">
		<Label for="password">Пароль</Label>
		<Input id="password" type="password" name="password" required />
	</div>
	<div
		data-captcha="hcaptcha"
		class="h-captcha"
		id="hcaptcha"
		data-sitekey="73161cf8-44fa-4a7c-b220-3c8c327c6da4"
		data-theme="dark"
	></div>
	<Button size="lg" type="submit">Войти</Button>
</form>
