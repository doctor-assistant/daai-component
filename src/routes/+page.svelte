<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';

	const logo = '/logo.png';

	let currentStatus = 'waiting_authorization';
	let microphoneStream: MediaStream | null = null;

	async function requestMicrophonePermission(): Promise<MediaStream> {
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		return stream;
	}

	onMount(async () => {
		try {
			microphoneStream = await requestMicrophonePermission();
			if (microphoneStream.active) {
				currentStatus = 'authorized';
			}
		} catch (error) {
			currentStatus = 'authorization_failed';
		}
	});

	function startRecording() {
		if (currentStatus === 'authorized') {
			currentStatus = 'recording';
		}
	}

	function stopRecording() {
		if (currentStatus === 'recording') {
			currentStatus = 'stopped';
		}
	}

	function pauseRecording() {
		if (currentStatus === 'recording') {
			currentStatus = 'paused';
		}
	}

	function resumeRecording() {
		if (currentStatus === 'paused') {
			currentStatus = 'recording';
		}
	}

	function finishRecording() {
		if (currentStatus === 'recording' || currentStatus === 'paused') {
			currentStatus = 'finished';
		}
	}
</script>

<div class="w-full h-screen flex items-center justify-center">
	<div class="text-gray-700 flex items-center gap-4 p-4 border-2 border-primary rounded-lg">
		<img src={logo} alt="daai-logo" />
		<button
			type="button"
			class="bg-recording text-white px-5 py-2.5 rounded-lg transition-transform duration-150 ease-in-out active:scale-95"
			on:click={pauseRecording}
		>
			<i class="fa-solid fa-pause"></i>
		</button>
		<button
			type="button"
			class="bg-primary text-white px-5 py-2.5 rounded-lg transition-transform duration-150 ease-in-out active:scale-95"
			on:click={startRecording}
		>
			<i class="fa-solid fa-microphone"></i>
			Iniciar Registro
		</button>
		<button
			type="button"
			class="bg-recording text-white px-5 py-2.5 rounded-lg transition-transform duration-150 ease-in-out active:scale-95"
			on:click={finishRecording}
		>
			<i class="fa-solid fa-check"></i>
			Finalizar Registro
		</button>
		<button
			type="button"
			class="bg-primary text-white px-5 py-2.5 rounded-lg transition-transform duration-150 ease-in-out active:scale-95"
			on:click={resumeRecording}
		>
			<i class="fa-solid fa-circle"></i>
			Continuar registro
		</button>
	</div>
</div>

<style>
</style>
