<script lang="ts">
	import { Toaster as Sonner, type ToasterProps as SonnerProps } from 'svelte-sonner'
	
	let { ...restProps }: SonnerProps = $props()
</script>

<Sonner
	class="toaster group"
	style="--normal-bg: hsl(var(--popover)); --normal-text: hsl(var(--popover-foreground)); --normal-border: hsl(var(--border));"
	richColors
	{...restProps}
/>
