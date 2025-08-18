import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, X, Download, Image, FileText } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

// Emoji picker data
const emojiCategories = {
  'Smileys': ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳'],
  'Gestures': ['👍', '👎', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👏', '🙌', '👐', '🤲', '🤝', '🙏'],
  'Objects': ['🔧', '🔨', '⚙️', '🛠️', '⚡', '🔥', '💡', '🔍', '📱', '💻', '⌨️', '🖥️', '🖨️', '📞', '📠', '📧', '📨', '📩', '📤', '📥', '📦', '📋', '📊', '📈', '📉'],
  'Vehicles': ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵', '🚲', '🛴', '🛹', '🚁', '✈️', '🚀', '⛵', '🚤', '🛥️', '🚢']
};

export default function TeamChat() {
  const { chatMessages, addChatMessage } = useData();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!message.trim() && selectedFiles.length === 0) || !user) return;

    // Handle file uploads
    if (selectedFiles.length > 0) {
      selectedFiles.forEach(file => {
        const fileUrl = URL.createObjectURL(file);
        addChatMessage({
          userId: user.id,
          userName: user.name,
          message: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'file',
          attachments: [{
            id: Date.now().toString(),
            name: file.name,
            type: file.type,
            size: file.size,
            url: fileUrl
          }]
        });
      });
      setSelectedFiles([]);
    }

    // Handle text message
    if (message.trim()) {
      addChatMessage({
        userId: user.id,
        userName: user.name,
        message: message.trim(),
        type: 'text'
      });
      setMessage('');
    }

    setShowEmojiPicker(false);
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const toggleEmojiPicker = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-IE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return messageDate.toLocaleDateString('en-IE', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Group messages by date
  const groupedMessages = chatMessages.reduce((groups: any, message) => {
    const date = formatDate(message.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-gray-200 h-[600px] flex flex-col relative ${dragOver ? 'border-blue-500 bg-blue-50' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Team Chat</h2>
        <p className="text-sm text-gray-500">Stay connected with your team</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(groupedMessages).map(([date, messages]: [string, any]) => (
          <div key={date}>
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gray-100 px-3 py-1 rounded-full">
                <span className="text-xs font-medium text-gray-600">{date}</span>
              </div>
            </div>
            
            {messages.map((msg: any) => (
              <div
                key={msg.id}
                className={`flex ${msg.userId === user?.id ? 'justify-end' : 'justify-start'} mb-3`}
              >
                <div className={`max-w-xs lg:max-w-md ${
                  msg.userId === user?.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                } rounded-lg px-4 py-2`}>
                  {msg.userId !== user?.id && (
                    <p className="text-xs font-medium mb-1 opacity-75">
                      {msg.userName}
                    </p>
                  )}
                  
                  {msg.type === 'text' && (
                    <p className="text-sm">{msg.message}</p>
                  )}
                  
                  {msg.type === 'image' && msg.attachments && (
                    <div className="space-y-2">
                      {msg.attachments.map((attachment: any) => (
                        <div key={attachment.id}>
                          <img 
                            src={attachment.url} 
                            alt={attachment.name}
                            className="max-w-full h-auto rounded"
                          />
                          <p className="text-xs mt-1">{attachment.name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {msg.type === 'file' && msg.attachments && (
                    <div className="space-y-2">
                      {msg.attachments.map((attachment: any) => (
                        <div key={attachment.id} className="flex items-center space-x-2 p-2 bg-black bg-opacity-10 rounded">
                          <FileText className="h-4 w-4" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{attachment.name}</p>
                            <p className="text-xs opacity-75">{formatFileSize(attachment.size)}</p>
                          </div>
                          <button
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = attachment.url;
                              link.download = attachment.name;
                              link.click();
                            }}
                            className="p-1 hover:bg-black hover:bg-opacity-10 rounded"
                          >
                            <Download className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <p className={`text-xs mt-1 ${
                    msg.userId === user?.id ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* File Preview */}
      {selectedFiles.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium text-gray-700">Selected files:</span>
          </div>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-white rounded border">
                {file.type.startsWith('image/') ? (
                  <Image className="h-4 w-4 text-blue-600" />
                ) : (
                  <FileText className="h-4 w-4 text-gray-600" />
                )}
                <span className="text-sm text-gray-700 flex-1 truncate">{file.name}</span>
                <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div 
          ref={emojiPickerRef}
          className="absolute bottom-20 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80 max-h-60 overflow-y-auto z-50"
        >
          <div className="space-y-3">
            {Object.entries(emojiCategories).map(([category, emojis]) => (
              <div key={category}>
                <h4 className="text-xs font-medium text-gray-600 mb-2">{category}</h4>
                <div className="grid grid-cols-8 gap-1">
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleEmojiSelect(emoji)}
                      className="p-1 hover:bg-gray-100 rounded text-lg transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Attach file"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={toggleEmojiPicker}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Add emoji"
            >
              <Smile className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={!message.trim() && selectedFiles.length === 0}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>

      {dragOver && (
        <div className="absolute inset-0 bg-blue-50 bg-opacity-90 flex items-center justify-center border-2 border-dashed border-blue-500 rounded-xl">
          <div className="text-center">
            <Paperclip className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-blue-700">Drop files here to share</p>
            <p className="text-sm text-blue-600">Images, documents, and other files are supported</p>
          </div>
        </div>
      )}
    </div>
  );
}