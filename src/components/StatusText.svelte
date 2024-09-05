<script lang="ts">
	import { currentStatus } from '../store.js';

	let message = '';
	let textColor = '';

	$: {
		if ($currentStatus === 'waiting_authorization') {
			message = 'Aguardando autorização do microfone';
			textColor = 'text-recording';
		} else if ($currentStatus === 'authorized') {
			message = 'Microfone';
			textColor = 'text-primary';
		} else if ($currentStatus === 'in_process') {
			message = 'Aguarde enquanto geramos o relatório final...';
			textColor = 'text-primary';
		} else if ($currentStatus === 'finish_upload') {
			message = 'Relatório finalizado!';
			textColor = 'text-process';
		} else {
			message = '';
			textColor = '';
		}
	}
</script>

<p class={textColor}>{message}</p>
