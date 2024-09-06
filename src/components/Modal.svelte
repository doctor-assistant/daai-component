<script lang="ts">
	export let deviceId: string | null = null;
	export let showModal: boolean = false;
	export let audioDevices: MediaDeviceInfo[] = [];
	export let closeModal: () => void;
	export let onChangeDevice: (deviceId: string) => void;

	function handleDeviceChange(deviceId: string) {
		onChangeDevice(deviceId);
		closeModal();
	}
</script>

{#if showModal}
	<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
		<div class="bg-white p-6 rounded-lg shadow-lg">
			<h2 class="text-xl font-bold mb-4">Escolha o Microfone</h2>
			<ul>
				{#each audioDevices as device}
					<li>
						<button
							type="button"
							class="block w-full text-left px-4 py-2 mb-2 border rounded-lg
								{device.deviceId === deviceId ? 'selected' : ''}"
							on:click={() => handleDeviceChange(device.deviceId)}
						>
							{device.label || 'Microfone sem nome'}
						</button>
					</li>
				{/each}
			</ul>
			<button
				type="button"
				class="mt-4 bg-primary text-white text-gray-700 px-4 py-2 rounded-lg"
				on:click={closeModal}
			>
				Fechar
			</button>
		</div>
	</div>
{/if}

<style>
	.selected {
		background-color: #f0f0f0;
		border-color: #007bff;
	}
</style>
