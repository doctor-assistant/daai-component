<script>
	export let status = 'waiting_authorization';
	let message = '';
	let bgColor = '';

	$: {
		if (status === 'waiting_authorization') {
			message = 'Aguardando autorização do microfone';
			bgColor = 'bg-yellow-500';
		} else if (status === 'in_process') {
			message = 'Aguarde enquanto geramos o relatório final...';
			bgColor = 'bg-blue-500';
		} else if (status === 'finish_upload') {
			message = 'Relatório finalizado!';
			bgColor = 'bg-green-500';
		} else {
			message = 'Estado desconhecido';
			bgColor = 'bg-gray-500';
		}
	}
</script>

<div class={`p-4 text-white ${bgColor}`}>
	<p>{message}</p>
</div>
