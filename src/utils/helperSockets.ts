export interface IWebSocketClientCallbacks {
    onOpen?: (ws: WebSocket) => void;
    onMessage?: (ws: WebSocket, message: MessageEvent) => void;
    onError?: (ws: WebSocket, error: Event) => void;
    onClose?: (ws: WebSocket, code: number, reason: string) => void;
}

export const createSocket = (
    url: string,
    { onOpen, onMessage, onError, onClose }: Partial<IWebSocketClientCallbacks> = {}
): WebSocket => {
    const ws = new WebSocket(url);

    ws.addEventListener('open', () => onOpen?.(ws));
    ws.addEventListener('message', (message) => onMessage?.(ws, message));
    ws.addEventListener('error', (error) => onError?.(ws, error));
    ws.addEventListener('close', (event) => onClose?.(ws, event.code, event.reason));

    return ws;
};
