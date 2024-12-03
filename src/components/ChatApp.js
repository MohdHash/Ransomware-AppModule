import React, { useState, useEffect, useRef } from "react";
import websocketService from "../service/websocketService";
import { fetchMessageHistory } from "../service/messageService";
import { FiArrowLeft, FiCheck, FiCheckDouble } from 'react-icons/fi';
import { FaCheckDouble } from 'react-icons/fa';

const ChatApp = ({ connectionId, receiverId, onBack, message, setMessage , shouldSendMessage , setShouldSendMessage , policeName }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const isFirstLoad = useRef(true); // Flag for initial load

  useEffect(() => {
    const loadHistory = async () => {
      const { messages: history, lastEvaluatedKey: newKey } = await fetchMessageHistory(
        connectionId,
        receiverId,
        lastEvaluatedKey
      );
      console.log(newKey);

      const parsedHistory = history.map((msg) => ({
        ...msg,
        isSent: msg.senderId === connectionId,
      }));

      setMessages((prevMessages) => [...parsedHistory, ...prevMessages]);
      setLastEvaluatedKey(newKey);
      setUnreadCount(0);

      if (isFirstLoad.current) {
        scrollToBottom();
        isFirstLoad.current = false; // Set to false after first load
      }
    };

    loadHistory();

    if (!websocketService.ws || websocketService.ws.readyState !== WebSocket.OPEN) {
      websocketService.connect(connectionId, (message) => {
        const updatedMessage = {
          ...message,
          isSent: message.senderId === connectionId,
        };
        setMessages((prevMessages) => [...prevMessages, updatedMessage]);
        if (!updatedMessage.isSent) {
          setUnreadCount((prevCount) => prevCount + 1);
        }
        scrollToBottom();
      });
    }

    return () => websocketService.close();
  }, [connectionId, receiverId]);

  const loadMoreMessages = async () => {
    if (!lastEvaluatedKey) return;

    const { messages: history, lastEvaluatedKey: newKey } = await fetchMessageHistory(
      connectionId,
      receiverId,
      lastEvaluatedKey
    );

    const parsedHistory = history.map((msg) => ({
      ...msg,
      isSent: msg.senderId === connectionId,
    }));

    setMessages((prevMessages) => [...parsedHistory, ...prevMessages]);
    setLastEvaluatedKey(newKey);
  };

  const handleScroll = () => {
    if (chatContainerRef.current.scrollTop === 0 && !isFirstLoad.current) {
      loadMoreMessages();
      console.log(isFirstLoad.current);
    }
  };

  const handleSendMessage = (message) => {
    if (inputMessage.trim() !== "" || message.trim() !== "") {
      const messageData = {
        action: "sendMessage",
        senderId: connectionId,
        receiverId: receiverId,
        content: inputMessage || message,
        timestamp: new Date().toISOString(),
        read: false,
      };

      websocketService.sendMessage(messageData);
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...messageData, isSent: true, read: false },
      ]);
      setInputMessage("");
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // console.log(message, shouldSendMessage);
    if (shouldSendMessage && message) {
      handleSendMessage(message);
      setShouldSendMessage(false);
      setMessage("");
    }
  }, [message, shouldSendMessage]);

  return (
    <div className="max-w-lg mx-auto bg-white text-gray-900 p-6 rounded-lg shadow-lg">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-4">
        {/* <button
          onClick={onBack}
          className="flex items-center gap-2 text-cyberGreen font-semibold text-gray-800 hover:text-gray-600 transition"
        >
          <FiArrowLeft className="text-xl" /> Back to Conversations
        </button> */}
        <h2 className="text-xl font-semibold text-gray-900">
          Chat with {policeName}{" "}
          {unreadCount > 0 && (
            <span className="text-sm font-normal text-red-500 ml-1">({unreadCount})</span>
          )}
        </h2>
      </div>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto border border-gray-300 rounded-lg p-3 bg-gray-50"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.isSent ? "justify-end" : "justify-start"} mb-3`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg ${
                msg.isSent ? "bg-green-100" : "bg-gray-200"
              } shadow-sm`}
            >
              <div className="text-sm">{msg.content}</div>
              <div className="text-xs text-gray-500 flex items-center justify-end gap-1 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {msg.isSent && !msg.read && (
                  <FiCheck className="text-gray-400 ml-1" />
                )}
                {msg.read && msg.isSent && (
                  <FaCheckDouble className="text-blue-500 ml-1" />
                )}
              </div>
            </div>
          </div>
        ))}
        {/* Scroll Helper */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatApp;
