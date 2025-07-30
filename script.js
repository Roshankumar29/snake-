body {
    font-family: 'Arial', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    margin: 0;
    background: linear-gradient(135deg, #1a1a2e, #16213e);
    color: #fff;
    overflow: hidden;
}

.game-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(0, 0, 0, 0.7);
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}

h1 {
    margin: 0 0 15px 0;
    color: #4cc9f0;
    text-shadow: 0 0 10px rgba(76, 201, 240, 0.5);
}

.score-board {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 10px;
    font-size: 1.2em;
}

.current-score, .high-score {
    padding: 5px 15px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.1);
}

.high-score {
    color: #f72585;
}

#game-canvas {
    border: 3px solid #4cc9f0;
    border-radius: 5px;
    background-color: #000;
    box-shadow: 0 0 20px rgba(76, 201, 240, 0.3);
}

.controls {
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

button {
    padding: 10px 20px;
    font-size: 1em;
    background: #4cc9f0;
    color: #000;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s;
    font-weight: bold;
}

button:hover {
    background: #f72585;
    color: white;
    transform: scale(1.05);
}

.mobile-controls {
    display: none;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    margin-top: 10px;
}

.mobile-controls div {
    display: flex;
    gap: 50px;
}

.control-btn {
    width: 60px;
    height: 60px;
    font-size: 1.5em;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(76, 201, 240, 0.3);
    color: white;
}

.control-btn:hover {
    background: rgba(247, 37, 133, 0.5);
}

.instructions {
    margin-top: 15px;
    text-align: center;
    font-size: 0.9em;
    color: #aaa;
}

.game-over {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.8);
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    display: none;
    z-index: 10;
}

.game-over h2 {
    color: #f72585;
    margin-top: 0;
}

@media (max-width: 600px) {
    .mobile-controls {
        display: flex;
    }
    
    #game-canvas {
        width: 300px;
        height: 300px;
    }
}
