import logo from './logo.svg';
import './App.css';

function App() {
  // Fetch /hey
  fetch('/hey').then(res => res.json()).then(data => {
    console.log(data);
  });
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
            Alix, c'est un connard et qu'il aille se faire foutre
        </p>
      
      </header>
    </div>
  );
}

export default App;
