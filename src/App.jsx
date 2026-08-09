import { useEffect, useState, useRef } from 'react'
import './App.css'

const GUEST_SESSION_API_URL = 'https://localhost:8027/api/guest-session'
const RECIPE_API_URL = 'https://localhost:8027/api/recipe-conversation'
const RECIPE_CONVERSATION_LIST_API_URL = 'https://localhost:8027/api/recipe-conversation-list'
const RECIPE_IMAGE_API_URL = 'https://localhost:8027/api/recipe-image'

function App() {
  const [authMode, setAuthMode] = useState(null)
  const [guestSession, setGuestSession] = useState(null)
  const [guestError, setGuestError] = useState(null)
  const newRecipe = { id: 0, title: 'New Recipe' }
  const [recipeConversationList, setRecipeConversationList] = useState([])
  const [activeConversation, setActiveConversation] = useState(0)
  const [chatMessages, setChatMessages] = useState([
    {
      id: `msg-${Date.now()}`,
      frm: 'ai',
      mtype: 'text',
      content: {'text': 'Hi! Send me a YouTube cooking video link or click a recipe to get started.'}
    },
  ])
  const [conversationId, setConversationId] = useState(null)
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false)
  const [recipeError, setRecipeError] = useState(null)
  const isSignUp = authMode === 'signup'
  const recipeConversation = new Map() // Map to store conversation state for each recipe

  const getRecipeConversation = async (conversationId) => {
    setActiveConversation(conversationId)
    setRecipeError(null)
    setIsLoadingRecipe(true)

    try {
      if (recipeConversation.has(conversationId)) {
        const messages = recipeConversation.get(conversationId)
        setChatMessages(messages)
        setIsLoadingRecipe(false)
        return
      }else{
        const recipeConversationAPIUrl = `${RECIPE_API_URL}/${conversationId}`
        const response = await fetch(recipeConversationAPIUrl, {
          method: 'GET',
          credentials: 'include'
        })

        if (!response.ok) {
          const text = await response.text()
          throw new Error(text || `Request failed with status ${response.status}`)
        }
        const data = await response.json()
        const messages = data.messages.map((message, index) => ({id: `msg-${Date.now()}-${index}`, ...message}))
        if (messages.length === 0) {
          setChatMessages([
            {
              id: `api-error-${Date.now()}`,
              frm: 'ai',
              mtype: 'text',
              content: {'text': 'I did not receive a recipe from the server. Please try again.'},
            },
          ])
        } else {
          setChatMessages(messages)
          setActiveConversation(data.id)
          if (conversationId === 0) {
            setRecipeConversationList([{"id": data.id, "title": data.title + " " + data.id }, ...recipeConversationList])
          }
          recipeConversation.set(activeConversation, messages) // Store the conversation state
        }
      }
    } catch (error) {
      const message = error?.message || 'Unable to reach recipe API.'
      setRecipeError(message)
      setChatMessages([
        {
          id: `api-error-${Date.now()}`,
          frm: 'ai',
          mtype: 'error',
          content: { description: message },
        },
      ])
    } finally {
      setIsLoadingRecipe(false)
    }
  }

  const updateRecipeConversation = async (text) => {
    setRecipeError(null)
    setIsLoadingRecipe(true)

    try {
      const recipeConversationAPIUrl = `${RECIPE_API_URL}/${activeConversation}`
      const message = {"frm": "user", "mtype": "text", "content": { "text": text }}
      setChatMessages((prev) => [
          ...prev,
          message,
      ])
      const response = await fetch(recipeConversationAPIUrl, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({"messages": [message]}),
      })
      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || `Request failed with status ${response.status}`)
      }
      const data = await response.json()
      if (data.title && data.title !== '') {
        const updatedRecipeConversationList = recipeConversationList.map((conversation) => {
          if (conversation.id === activeConversation) {
            return { ...conversation, title: data.title }
          }
          return conversation
        })
        console.log('updatedRecipeConversationList', updatedRecipeConversationList)
        setRecipeConversationList(updatedRecipeConversationList)
      }
      const messages = data.messages.map((message, index) => ({id: `msg-${Date.now()}-${index}`, ...message}))  
      if (messages.length === 0) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: `api-error-${Date.now()}`,
            frm: 'ai',
            mtype: 'text',
            content: {'text': 'I did not receive a recipe from the server. Please try again.'},
          },
        ])
      } else {
        setChatMessages((prev) => [...prev, ...messages])
        recipeConversation.get(activeConversation)?.push(...messages) // Update the conversation state
      }
    } catch (error) {
      const message = error?.message || 'Unable to reach recipe API.'
      setRecipeError(message)
      setChatMessages((prev) => [
        ...prev,
        {
          id: `api-error-${Date.now()}`,
          frm: 'ai',
          mtype: 'error',
          content: { description: message },
        },
      ])
    } finally {
      setIsLoadingRecipe(false)
    }
  }

  const inputRef = useRef(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    const inputValue = inputRef.current.value;
    
    if (!inputValue.trim()) return;

    updateRecipeConversation(inputValue);
    inputRef.current.value = ''; // Clear input
  };

  useEffect(() => {
    const createGuestSession = async () => {
      try {
        const response = await fetch(GUEST_SESSION_API_URL, {
          method: 'POST',
          credentials: 'include',
        })

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const data = await response.json()
        if (data.status === "success") {
          setGuestSession({"username": "GUEST"})
        } else {
          setGuestSession({"username": "NO-GUEST"})
        }
      } catch (error) {
        console.error('Failed to create guest session', error)
        setGuestError(error.message)
      }
    }

    createGuestSession()
  }, [])

  useEffect(() => {
    const getRecipeConversationList = async () => {
      try {
        const response = await fetch(RECIPE_CONVERSATION_LIST_API_URL, {
          method: 'GET',
          credentials: 'include',
        })

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }
        const data = await response.json()
        if (response.ok && data.recipe_conversations && data.recipe_conversations.length > 0) {
          const recipe_conversation_list = data.recipe_conversations.map((conversation) => 
          ({ id: conversation.id, title: conversation.title + " " + conversation.id }))
          setRecipeConversationList(recipe_conversation_list)
          setActiveConversation(recipe_conversation_list[0].id)
          getRecipeConversation(recipe_conversation_list[0].id)
        } else {
          setRecipeConversationList([])
          setActiveConversation(0)
          getRecipeConversation(0)
        }
        console.log('recipeConversationList', recipeConversationList)
      } catch (error) {
        console.error('Failed to get conversation list', error)
      }
    }

    getRecipeConversationList()
  }, [guestSession])

  const renderMessageContent = (message) => {
    if (message.frm === 'user') {
      return <p>{message.content.text}</p>;
    } else if (message.mtype === 'recipe') {
      return (
        <div>
          <p>{message.content.description}</p>
          {message.content.steps?.length > 0 && (
            <ol className="recipe-steps">
              {message.content.steps.map((step, index) => (
                <li key={index}>
                  {step.description}
                  <p>
                    <img
                      src={`${RECIPE_IMAGE_API_URL}/${step.image_url}`}
                      alt={`Step ${index + 1} Image`}
                    />
                  </p>
                </li>
              ))}
            </ol>
          )}
        </div>
      );
  } else if (message.mtype === 'ingredient') {
    return (
      <div>
        <p>The list of ingredients:</p>
        {message.content.ingredients?.length > 0 && (
          <ul className="recipe-ingredients">
            {message.content.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }else {
    return <p>{message.content.text}</p>;
  }
  };

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="brand">
          <div className="brand-icon">🍳</div>
          <div className="brand-copy">
            <strong>RecipeAI</strong>
            <span>From YouTube to Recipe</span>
          </div>
        </div>
        <div className="top-actions">
          {guestSession?.username && (
            <div className="guest-pill" title={guestSession.username}>
              <span className="guest-pill-label">{guestSession.username}</span>
            </div>
          )}
          <button type="button" className="button sign-in-button" onClick={() => setAuthMode('signin')}>
            Sign in
          </button>
          <button type="button" className="button sign-up-button" onClick={() => setAuthMode('signup')}>
            Sign up
          </button>
        </div>
      </header>

      {authMode && (
        <div className="modal-backdrop" onClick={() => setAuthMode(null)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>{isSignUp ? 'Create account' : 'Sign in'}</h3>
                <p>{isSignUp ? 'Enter your username and password to get started.' : 'Enter your username and password to continue.'}</p>
              </div>
              <button type="button" className="modal-close" onClick={() => setAuthMode(null)}>
                ×
              </button>
            </div>
            <form className="signin-form" onSubmit={(event) => event.preventDefault()}>
              <label>
                Username
                <input type="text" placeholder="Username" />
              </label>
              <label>
                Password
                <input type="password" placeholder="Password" />
              </label>
              {isSignUp && (
                <label>
                  Re-enter Password
                  <input type="password" placeholder="Confirm Password" />
                </label>
              )}
              <button type="submit" className="button">
                {isSignUp ? 'Sign up' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="page-grid">
        <aside className="sidebar">
          <div className="panel-card sidebar-panel">
            <div className="nav-header">
              <h2>New Recipe</h2>
              <span className="nav-badge"><button
              key="recipe-conversation-0"
              type="button"
              className={`nav-item 'active'`}
              onClick={() => getRecipeConversation(0)}>
              +
            </button></span>
            </div>
            <nav className="nav-list">
              {recipeConversationList.map((conversation) => (
                <button
                  key={`recipe-conversation-${conversation.id}`}
                  type="button"
                  className={`nav-item ${activeConversation === conversation.id ? 'active' : ''}`}
                  onClick={() => getRecipeConversation(conversation.id)}
                  disabled={isLoadingRecipe}
                >
                  {conversation.title}
                </button>
              ))}
            </nav>
          </div>

          <div className="panel-card sidebar-panel">
            <h3>How it works</h3>
            <ol className="steps-list">
              <li>
                <span>1</span>
                <div>
                  <strong>Share YouTube Link</strong>
                  <p>Paste any cooking video link.</p>
                </div>
              </li>
              <li>
                <span>2</span>
                <div>
                  <strong>AI Processes Video</strong>
                  <p>We extract ingredients and steps.</p>
                </div>
              </li>
              <li>
                <span>3</span>
                <div>
                  <strong>Get Recipe</strong>
                  <p>View step-by-step recipe with images.</p>
                </div>
              </li>
            </ol>
          </div>
        </aside>

        <main className="chat-panel">
          <div className="panel-card chat-card">
            <div className="panel-header">
              <div>
                <p className="panel-label">Recipe Assistant</p>
                <h2>I'll help you turn any YouTube cooking video into a step-by-step recipe!</h2>
              </div>
            </div>

            <div className="chat-window">
              {chatMessages.map((message) => (
                <div key={message.id} className={`message ${message.frm === 'user' ? 'user' : 'bot'}`}>
                  <div className={`message-bubble ${message.frm === 'user' ? 'user-bubble' : ''}`}>
                    {renderMessageContent(message)}
                  </div>
                  <span className="message-time">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}

              {isLoadingRecipe && (
                <div className="message bot">
                  <div className="message-bubble">
                    <p>Analyzing the recipe request...</p>
                    <div className="loading-dots" aria-hidden="true">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                  <span className="message-time">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}
            </div>
          </div>
            <form className="chat-form" onSubmit={handleSubmit}>
              <input ref={inputRef} type="text" placeholder="Your message..." aria-label="Your message" />
              <button type="submit">Send</button>
            </form>
        </main>
      </div>
    </div>
  )
}

export default App
