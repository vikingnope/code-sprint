import { useState, useRef, useEffect } from 'react'
import { FaRobot, FaPaperPlane, FaTimes } from 'react-icons/fa'
import { generateResponse } from '@/utils/chatbotEngine'

const SpendyBuddy = ({ transactions, monthlyData }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm SpendyBuddy, your personal spending assistant! 🤖✨\n\nI can help you understand your spending patterns, find ways to save money, and answer questions about your finances. Try asking me things like:\n\n• \"How much did I spend on food last month?\"\n• \"What's my biggest expense category?\"\n• \"How can I save more money?\"\n• \"Show me my spending trends\"\n\nWhat would you like to know about your finances?",
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      // Scroll to bottom when chatbot is opened
      setTimeout(() => {
        scrollToBottom()
      }, 100)
    }
  }, [isOpen])

  const handleToggleChat = () => {
    if (isOpen) {
      // Closing
      setIsAnimating(true)
      setIsOpen(false) // Set isOpen to false immediately to trigger closing animation
      setTimeout(() => {
        setIsAnimating(false)
      }, 400) // Match the animation duration
    } else {
      // Opening
      setIsOpen(true)
      setIsAnimating(true)
      setTimeout(() => {
        setIsAnimating(false)
      }, 400) // Match the animation duration
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    try {
      // Simulate typing delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const botResponse = generateResponse(inputMessage, transactions, monthlyData)
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error generating response:', error)
      const errorMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: "I'm sorry, I encountered an error while processing your request. Please try again!",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatMessage = (content) => {
    const renderMarkdown = (text) => {
      // Handle bold text (**text**)
      let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
      
      // Handle italic text (*text*)
      formatted = formatted.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em class="italic">$1</em>')
      
      // Handle code blocks (`code`)
      formatted = formatted.replace(/`(.*?)`/g, '<code class="bg-slate-600 px-2 py-1 rounded text-sm font-mono">$1</code>')
      
      // Handle bullet points (• text) - make them stand out
      formatted = formatted.replace(/^•\s+(.*)$/gm, '<span class="block ml-2">• $1</span>')
      
      return formatted
    }

    return content.split('\n').map((line, index) => (
      <span key={index}>
        <span 
          dangerouslySetInnerHTML={{ 
            __html: renderMarkdown(line) 
          }} 
        />
        {index < content.split('\n').length - 1 && <br />}
      </span>
    ))
  }

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const quickActions = [
    "What's my spending summary?",
    "How much did I spend on food?",
    "What are my biggest expenses?",
    "Show me savings tips",
    "Analyze my spending trends"
  ]

  const handleQuickAction = async (action) => {
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: action,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    try {
      // Simulate typing delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const botResponse = generateResponse(action, transactions, monthlyData)
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error generating response:', error)
      const errorMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: "I'm sorry, I encountered an error while processing your request. Please try again!",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  if (!isOpen && !isAnimating) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleToggleChat}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group animate-bounce-subtle"
        >
          <FaRobot className="text-2xl group-hover:animate-pulse" />
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
            !
          </div>
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chatbot window - show during opening or when open, hide only when fully closed */}
      {(isOpen || isAnimating) && (
        <div className={`
          bg-slate-900 rounded-lg shadow-2xl border border-slate-700 w-96 h-[500px] flex flex-col overflow-hidden
          origin-bottom-right
          ${isOpen && !isAnimating ? 'opacity-100 scale-100' : ''}
          ${!isOpen && isAnimating ? 'animate-slide-down-fade-out' : ''}
          ${isOpen && isAnimating ? 'animate-slide-up-fade-in' : ''}
        `}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <FaRobot className="text-lg" />
            </div>
            <div>
              <h3 className="font-bold">SpendyBuddy</h3>
              <p className="text-xs opacity-90">Your spending assistant</p>
            </div>
          </div>
          <button
            onClick={handleToggleChat}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-800">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white ml-4'
                        : 'bg-slate-700 text-slate-100 mr-4'
                    }`}
                  >
                    <div className="text-sm prose prose-invert max-w-none">
                      {formatMessage(message.content)}
                    </div>
                    <div className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-slate-400'
                    }`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}

              {/* Show quick actions as a bot message only for the first interaction */}
              {messages.length === 1 && (
                <div className="flex justify-start animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <div className="bg-slate-700 text-slate-100 p-3 rounded-lg mr-4 max-w-[80%]">
                    <div className="text-sm mb-3">Here are some quick actions to get you started:</div>
                    <div className="flex flex-wrap gap-2">
                      {quickActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickAction(action)}
                          className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full transition-colors"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {isTyping && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-slate-700 text-slate-100 p-3 rounded-lg mr-4">
                    <div className="flex items-center gap-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-slate-400 ml-2">SpendyBuddy is typing...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-600 bg-slate-800">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about your spending..."
                  className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-100 placeholder-slate-400"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 text-white p-2 rounded-lg transition-colors"
                >
                  <FaPaperPlane />
                </button>
              </div>
            </div>
        </div>
      )}
    </div>
  )
}

export default SpendyBuddy
