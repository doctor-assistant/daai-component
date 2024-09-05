import { writable } from 'svelte/store';

export const currentStatus = writable('unauthorized');

export const showModal = writable(false)

export const devices = writable([]);
