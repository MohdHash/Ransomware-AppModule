class WebSocketService {
    constructor() {
      this.ws = null;
      this.apiGatewayUrl = "wss://9g2toduzcb.execute-api.eu-west-1.amazonaws.com/sender";
    }
  
    connect(clientId, onMessageReceived) {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        console.log("WebSocket is already open.");
        return;
      }
    
      const url = `${this.apiGatewayUrl}?clientId=${clientId}`;
      this.ws = new WebSocket(url);
    
      this.ws.onopen = () => {
        console.log("WebSocket connection opened.");
      };
    
      this.ws.onmessage = (messageEvent) => {
        try {
          const messageData = JSON.parse(messageEvent.data);
          const messageWithTimestamp = {
            ...messageData,
            timestamp: new Date().toISOString(),
            content: messageData.message,
          };
          onMessageReceived(messageWithTimestamp);
        } catch (error) {
          console.error("Failed to parse message data:", error, messageEvent.data);
        }
      };
    
      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    
      this.ws.onclose = () => {
        console.log("WebSocket connection closed.");
      };
    }
    
    sendMessage(messageData) {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(
          JSON.stringify({
            action: "sendMessage",
            senderId: messageData.senderId,
            receiverId: messageData.receiverId,
            message: messageData.content,
          })
        );
        console.log("Message sent through WebSocket.");
      } else {
        console.warn("WebSocket connection is not open. Message not sent.");
      }
    }
  
    close() {
      if (this.ws) {
        this.ws.close();
        console.log("WebSocket connection closed.");
      }
    }
  }
  
  export default new WebSocketService();
  