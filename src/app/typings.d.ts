type Callback = (data: any) => void;

declare class EventSource {
  onmessage: Callback;
  onerror: Callback;

  addEventListener(event: string, cb: Callback): void;
  close(): void;
  constructor(name: string);
}
