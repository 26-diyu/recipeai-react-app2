import { useState } from 'react'
import './App.css'

function App() {
  const [authMode, setAuthMode] = useState(null)
  const isSignUp = authMode === 'signup'

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
              <span className="nav-badge">+</span>
            </div>
            <nav className="nav-list">
              <button className="nav-item active">New Recipe</button>
              <button className="nav-item">Fried Rice Recipe</button>
              <button className="nav-item">Olive Pasta Recipe</button>
              <button className="nav-item">Margherita Pizza Recipe</button>
              <button className="nav-item">Veg Burger Recipe</button>
              <button className="nav-item">Veg Biryani Recipe</button>
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

          <div className="panel-card tip-card">
            <strong>Tip</strong>
            <p>Use videos with clear cooking instructions for best results.</p>
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
              <div className="message bot">
                <div className="message-bubble">
                  <p>Hi! 👋</p>
                  <p>Send me a YouTube cooking video link and I'll generate the recipe for you.</p>
                </div>
                <span className="message-time">10:30 AM</span>
              </div>

              <div className="message user">
                <div className="message-bubble user-bubble">
                  <p>https://www.youtube.com/watch?v=dQw4w9WgXcQ</p>
                </div>
                <span className="message-time">10:31 AM</span>
              </div>

              <div className="message bot">
                <div className="message-bubble">
                  <p>Great! Let me analyze this video and extract the recipe for you...</p>
                  <div className="loading-dots" aria-hidden="true">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <span className="message-time">10:31 AM</span>
              </div>

              <div className="message bot">
                <div className="message-bubble">
                  <p>Done! 🎉</p>
                  <p>Here's the recipe I generated from the video.</p>
                  <button type="button" className="view-recipe-button">View Recipe</button>
                </div>
                <span className="message-time">10:32 AM</span>
              </div>

              <div className="message bot">
                <div className="message-bubble">
                  <p>Done! 🎉</p>
                  <p>Step-by-step instructions for making Punjabi Samosas</p>
                  Mix 2 cups maida (around 250 gms) with 1/2 spoon salt and 1/4 spoon ajwain<br></br>
                  <img src=".\data\exnez7phjD8\key_frames\frame_at_0.0s.jpg" className="recipe-image" /><br></br>
                  Add 4-5 table spoons of ghee and mix well to give a nice crust on top<br></br>
                  <img src=".\data\exnez7phjD8\key_frames\frame_at_4.86s.jpg" className="recipe-image" /><br></br>
                  Check the consistency and add water little by little until dough is little hard<br></br>
                  <img src=".\data\exnez7phjD8\key_frames\frame_at_10.74s.jpg" className="recipe-image" /><br></br>
                  Mix 1 table spoon oil, 1/2 spoon hing, 1 spoon jeera, 1 spoon dhaniya seeds, and 1/2 spoon saunf<br></br>
                  <img src=".\data\exnez7phjD8\key_frames\frame_at_136.88s.jpg" className="recipe-image" /><br></br>
                  Add 1 table spoon ginger and mix well<br></br>
                  <img src=".\data\exnez7phjD8\key_frames\frame_at_162.66s.jpg" className="recipe-image" /><br></br>
                  Add 2 green chillies finely cut and mix well<br></br>
                  <img src=".\data\exnez7phjD8\key_frames\frame_at_173.72s.jpg" className="recipe-image" /><br></br>
                  Add 1/2 cup green mutter (use either frozen or boiled) and mix for around 1-2 mins<br></br>
                  <img src=".\data\exnez7phjD8\key_frames\frame_at_180.98s.jpg" className="recipe-image" /><br></br>
                </div>
                <span className="message-time">10:32 AM</span>
              </div>

              <div className="message bot">
                <div className="message-bubble">
                  <p>Let me improve the recipe by filtering out the faroff images...</p>
                  <div className="loading-dots" aria-hidden="true">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <span className="message-time">10:31 AM</span>
              </div>

              <div className="message bot">
                <div className="message-bubble">
                  <p>Removing Far off images with ML Classifier Service</p>
                  <button type="button" className="view-recipe-button">View Improved Recipe</button>
                </div>
                <span className="message-time">10:32 AM</span>
              </div>
              <div className="message bot">
                <div className="message-bubble">
                  <p>Images filtered out by ML Classifier</p>
                  Mix 2 cups maida (around 250 gms) with 1/2 spoon salt and 1/4 spoon ajwain<br></br>
                 <img src=".\data\exnez7phjD8\key_frames\frame_at_0.0s.jpg" className="recipe-image" /><br></br>
                  Add 4-5 table spoons of ghee and mix well to give a nice crust on top<br></br>
                  <img src=".\data\exnez7phjD8\key_frames\frame_at_4.86s.jpg" className="recipe-image" /><br></br>
                  Check the consistency and add water little by little until dough is little hard<br></br>
                  <img src=".\data\exnez7phjD8\key_frames\frame_at_10.74s.jpg" className="recipe-image" /><br></br>
                  Mix 1 table spoon oil, 1/2 spoon hing, 1 spoon jeera, 1 spoon dhaniya seeds, and 1/2 spoon saunf<br></br>
                </div>
                <span className="message-time">10:32 AM</span>
                <div className="message bot">
                <div className="message-bubble">
                  <p>Improved Recipe to make Punjabi Samosas</p>
                  Mix 2 cups maida (around 250 gms) with 1/2 spoon salt and 1/4 spoon ajwain<br></br>
                  Add 4-5 table spoons of ghee and mix well to give a nice crust on top<br></br>
                  Check the consistency and add water little by little until dough is little hard<br></br>
                  Mix 1 table spoon oil, 1/2 spoon hing, 1 spoon jeera, 1 spoon dhaniya seeds, and 1/2 spoon saunf<br></br>
                  <img src=".\data\exnez7phjD8\key_frames\frame_at_136.88s.jpg" className="recipe-image" /><br></br>
                  Add 1 table spoon ginger and mix well<br></br>
                  <img src=".\data\exnez7phjD8\key_frames\frame_at_162.66s.jpg" className="recipe-image" /><br></br>
                  Add 2 green chillies finely cut and mix well<br></br>
                  <img src=".\data\exnez7phjD8\key_frames\frame_at_173.72s.jpg" className="recipe-image" /><br></br>
                  Add 1/2 cup green mutter (use either frozen or boiled) and mix for around 1-2 mins<br></br>
                  <img src=".\data\exnez7phjD8\key_frames\frame_at_180.98s.jpg" className="recipe-image" /><br></br>
                </div>
                <span className="message-time">10:32 AM</span>
              </div>
              <div className="message bot">
                <div className="message-bubble">
                  <p>Would you like to see the list of ingredients?</p>
                </div>
                <span className="message-time">10:31 AM</span>
              </div>
              <div className="message user">
                <div className="message-bubble user-bubble">
                  <p>Yes, I would like to see the list of ingredients</p>
                </div>
                <span className="message-time">10:33 AM</span>
              </div>
              <div className="message bot">
                <div className="message-bubble">
                  <p>The list of ingredients is as follows:</p>
                  <ul>
                    <li>2 cups maida (around 250 gms)</li>
                    <li>1/2 spoon salt</li>
                    <li>1/4 spoon ajwain</li>
                    <li>4-5 table spoons of ghee</li>
                    <li>Water (as needed)</li>
                    <li>1 table spoon oil</li>
                    <li>1/2 spoon hing</li>
                    <li>1 spoon jeera</li>
                    <li>1 spoon dhaniya seeds</li>
                    <li>1/2 spoon saunf</li>
                    <li>1 table spoon ginger</li>
                    <li>2 green chillies (finely cut)</li>
                    <li>1/2 cup green mutter (frozen or boiled)</li>
                  </ul>
                </div>
                <span className="message-time">10:34 AM</span>
              </div>
            </div>
          </div>
           <form className="chat-form">
              <input type="text" placeholder="Your message..." aria-label="YouTube link" />
              <button type="submit">Send</button>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
