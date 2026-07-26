export function updateScore(score) {
  document.getElementById('score').innerText = 'Score: ' + score;
}

export function showLeaderboard() {
  const highScores = JSON.parse(localStorage.getItem('qubitHighScores')) || [];
  const container = document.getElementById('leaderboard');
  container.innerHTML = '';
  highScores.forEach(entry => {
    const div = document.createElement('div');
    div.innerText = `${entry.name} - ${entry.score} (${new Date(entry.time).toLocaleString()})`;
    container.appendChild(div);
  });
}
