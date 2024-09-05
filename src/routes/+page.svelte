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
		<button type="button" class="bg-recording text-white px-5 py-2.5 rounded-lg">
			<i class="fa-solid fa-pause"></i>
		</button>
		<button type="button" class="bg-primary text-white px-5 py-2.5 rounded-lg">
			<i class="fa-solid fa-microphone"></i>
			Iniciar Registro
		</button>
		<button type="button" class="bg-recording text-white px-5 py-2.5 rounded-lg">
			<i class="fa-solid fa-check"></i>
			Finalizar Registro
		</button>
		<button type="button" class="bg-primary text-white px-5 py-2.5 rounded-lg">
			<i class="fa-solid fa-circle"></i>
			Continuar registro
		</button>
	</div>
</div>

<style>
</style>
