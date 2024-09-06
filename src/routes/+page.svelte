<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import Modal from '../components/Modal.svelte';
	import StatusText from '../components/StatusText.svelte';
	import { currentStatus } from '../store.js';

	let microphoneStream: MediaStream | null = null;
	let mediaRecorder: MediaRecorder | null = null;
	let audioChunks: Blob[] = [];
	let audioUrl: string | null = null;
	let audioDevices: MediaDeviceInfo[] = [];
	let selectedDeviceId: string | null = null;
	let modalOpen = false;
	const logo = '/logo.png';

	async function requestMicrophonePermission(deviceId?: string): Promise<MediaStream> {
		const constraints = {
			audio: deviceId ? { deviceId: { exact: deviceId } } : true
		};
		const stream = await navigator.mediaDevices.getUserMedia(constraints);
		return stream;
	}

	async function getAudioDevices() {
		const devices = await navigator.mediaDevices.enumerateDevices();
		audioDevices = devices.filter((device) => device.kind === 'audioinput');
	}

	//@ts-ignore
	onMount(async () => {
		await getAudioDevices();
		const savedStatus = localStorage.getItem('currentStatus');
		if (savedStatus) {
			currentStatus.set(savedStatus);
		} else {
			try {
				microphoneStream = await requestMicrophonePermission();
				if (microphoneStream.active) {
					currentStatus.set('authorized');
				} else {
					currentStatus.set('waiting_authorization');
				}
			} catch (error) {
				currentStatus.set('authorization_failed');
			}
		}

		const unsubscribe = currentStatus.subscribe((value) => {
			localStorage.setItem('currentStatus', value);
		});

		return () => {
			unsubscribe();
		};
	});

	async function startRecording() {
		if ($currentStatus === 'authorized') {
			currentStatus.set('recording');

			if (microphoneStream) {
				try {
					mediaRecorder = new MediaRecorder(microphoneStream, { mimeType: 'audio/webm' });

					mediaRecorder.ondataavailable = (event) => {
						if (event.data.size > 0) {
							audioChunks.push(event.data);
							console.log('Data available:', event.data);
						}
					};

					mediaRecorder.onstop = () => {
						if (audioChunks.length > 0) {
							const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
							audioUrl = URL.createObjectURL(audioBlob);
							const audio = new Audio(audioUrl);
							audio.play();
							audioChunks = [];
						} else {
							console.log('No audio chunks available.');
						}
					};

					mediaRecorder.onerror = (event) => {
						console.error('MediaRecorder error:', event.error);
					};

					mediaRecorder.start();
				} catch (error) {
					console.error('Failed to start recording:', error);
				}
			}
		}
	}

	function pauseRecording() {
		if ($currentStatus === 'recording' && mediaRecorder && mediaRecorder.state === 'recording') {
			mediaRecorder.pause();
			currentStatus.set('paused');
		}
	}

	function resumeRecording() {
		if ($currentStatus === 'paused' && mediaRecorder && mediaRecorder.state === 'paused') {
			mediaRecorder.resume();
			currentStatus.set('recording');
		}
	}

	function finishRecording() {
		if (($currentStatus === 'recording' || $currentStatus === 'paused') && mediaRecorder) {
			mediaRecorder.stop();
			currentStatus.set('in_process');
		}
	}

	function downloadRecording() {
		if (audioUrl) {
			const link = document.createElement('a');
			link.href = audioUrl;
			link.download = 'recording.webm';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} else {
			console.error('No audio URL available for download.');
		}
	}

	async function changeMicrophone(deviceId: string) {
		if (microphoneStream) {
			microphoneStream.getTracks().forEach((track) => track.stop());
		}
		microphoneStream = await requestMicrophonePermission(deviceId);
		if (microphoneStream.active) {
			currentStatus.set('authorized');
		}
	}

	function openModal() {
		modalOpen = true;
	}

	function closeModal() {
		modalOpen = false;
	}
</script>

<div class="w-full h-screen flex items-center justify-center">
	<div class="text-gray-700 flex items-center gap-4 p-4 border-2 border-primary rounded-lg">
		<img src={logo} alt="daai-logo" />
		<StatusText />
		<button
			type="button"
			class="text-gray-400 rounded-lg transition-transform duration-150 ease-in-out active:scale-95"
			on:click={openModal}
		>
			<i class="fa-solid fa-gear"></i>
		</button>
		{#if $currentStatus === 'recording' || $currentStatus === 'paused' || $currentStatus === 'authorized'}
			<button
				type="button"
				class="bg-recording text-white px-5 py-2.5 rounded-lg transition-transform duration-150 ease-in-out active:scale-95"
				on:click={pauseRecording}
			>
				<i class="fa-solid fa-pause"></i>
			</button>
		{/if}
		{#if $currentStatus === 'waiting_authorization' || $currentStatus === 'authorized'}
			<button
				type="button"
				class="bg-primary text-white px-5 py-2.5 rounded-lg transition-transform duration-150 ease-in-out active:scale-95"
				on:click={startRecording}
			>
				<i class="fa-solid fa-microphone"></i>
				Iniciar Registro
			</button>
		{/if}
		{#if $currentStatus === 'recording'}
			<button
				type="button"
				class="bg-recording text-white px-5 py-2.5 rounded-lg transition-transform duration-150 ease-in-out"
				on:click={finishRecording}
			>
				<i class="fa-solid fa-check"></i>
				Finalizar Registro
			</button>
		{/if}
		{#if $currentStatus === 'paused'}
			<button
				type="button"
				class="bg-primary text-white px-5 py-2.5 rounded-lg transition-transform duration-150 ease-in-out active:scale-95"
				on:click={resumeRecording}
			>
				<i class="fa-solid fa-circle"></i>
				Continuar registro
			</button>
		{/if}

		<!-- Provisório não teremos essa funcionalidade -->
		{#if $currentStatus === 'in_process'}
			<button
				type="button"
				class="bg-green-500 text-white px-5 py-2.5 rounded-lg transition-transform duration-150 ease-in-out active:scale-95"
				on:click={downloadRecording}
			>
				<i class="fa-solid fa-download"></i>
				Download Registro
			</button>
		{/if}
	</div>
</div>

<Modal
	deviceId={selectedDeviceId}
	showModal={modalOpen}
	{audioDevices}
	{closeModal}
	onChangeDevice={changeMicrophone}
/>
