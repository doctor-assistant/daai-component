<script>
	import '../app.css';
	const logo = '/logo.png';
	const pauseIcon = '/pause.png';

	let currentStatus = 'waiting_authorization';

	function startRecording() {
		currentStatus = '';
	}

	function stopRecording() {
		currentStatus = 'in_process';
	}

	function pauseRecording() {}

	function resumeRecording() {}

	function finishRecording() {}
</script>

<div class="w-full h-screen flex items-center justify-center">
	<div class="text-gray-700 flex items-center gap-4 p-4 border-2 border-primary rounded-lg">
		<img src={logo} alt="daai-logo" />
		<div></div>
		<button
			type="button"
			class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
		>
			<img src={pauseIcon} alt="daai-logo" />
		</button>
		<button
			type="button"
			class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
			>Iniciar Registro</button
		>
		<button
			type="button"
			class="text-white bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
			>Finalizar Registro</button
		>
	</div>
</div>

<style>
</style>
