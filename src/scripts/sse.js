import { EventSource } from 'https://esm.run/extended-eventsource@1.4.9';

class EventSourceManager {
  constructor(apiKey, url, onMessage) {
    this.apiKey = apiKey;
    this.url = url;
    this.onMessage = onMessage;
    this.eventSource = null;
    this.retryDelay = 5000;
    this.reconnectTimeout = null;

    this.handleOpen = this.handleOpen.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.handleError = this.handleError.bind(this);
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => this.close());
  }

  connect() {
    if (this.eventSource) {
      console.warn('EventSource is already connected.');
      return;
    }

    const eventSourceOptions = {
      headers: { 'x-daai-api-key': this.apiKey },
    };

    this.eventSource = new EventSource(this.url, eventSourceOptions);

    this.eventSource.onopen = this.handleOpen;
    this.eventSource.onmessage = this.handleMessage;
    this.eventSource.onerror = this.handleError;
  }

  handleOpen() {
    console.info('SSE connection opened.');
  }

  handleMessage(event) {
    try {
      const data = JSON.parse(event.data);
      this.onMessage(data);
      if (data.event === 'consultation.integrated') {
        this.close();
      }
    } catch (error) {
      console.error('Error parsing SSE data:', error);
    }
  }

  handleError(error) {
    console.error('SSE connection error:', error);
    this.reconnect();
  }

  reconnect() {
    console.info(`Reconnecting in ${this.retryDelay / 1000} seconds...`);
    // Clear any existing reconnect timeout
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    this.reconnectTimeout = setTimeout(() => this.connect(), this.retryDelay);
  }

  close() {
    // Clear any pending reconnect timeout
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.eventSource) {
      console.info('Closing SSE connection.');
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}

export { EventSourceManager };
