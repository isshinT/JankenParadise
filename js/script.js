(() => {
  const hands = ['グー', 'チョキ', 'パー'];
  const buttons = document.querySelectorAll('.hand');
  const resultDiv = document.getElementById('result');
  const scoreDiv = document.getElementById('score');
  const rankDiv = document.getElementById('rank');
  const retryBtn = document.getElementById('retryBtn');
  const achievementDiv = document.getElementById('achievement');
  const soundNotice = document.getElementById('soundNotice');

  const clickSound = document.getElementById('clickSound');
  const winSound = document.getElementById('winSound');
  const loseSound = document.getElementById('loseSound');

  let winCount = 0;
  let bestScore = localStorage.getItem('bestScore') || 0;
  bestScore = Number(bestScore);

  // iOS Safariなどでユーザー操作前は音再生不可
  let soundEnabled = false;
  function enableSound() {
    if (soundEnabled) return;
    soundEnabled = true;
    soundNotice.hidden = true;
  }
  // 最初の画面タップで音を有効化
  window.addEventListener('click', enableSound, { once: true });
  window.addEventListener('touchstart', enableSound, { once: true });

  function playSound(sound) {
    if (!soundEnabled) return;
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }

  function judge(player, computer) {
    if (player === computer) return 'あいこ';
    if (
      (player === 'グー' && computer === 'チョキ') ||
      (player === 'チョキ' && computer === 'パー') ||
      (player === 'パー' && computer === 'グー')
    ) {
      return '勝ち';
    }
    return '負け';
  }

  function updateBackground(winCount) {
    if (winCount >= 10) {
      document.body.style.background = 'linear-gradient(to right, #fceabb, #f8b500)';
    } else if (winCount >= 5) {
      document.body.style.background = 'linear-gradient(to right, #a8edea, #fed6e3)';
    } else {
      document.body.style.background = 'linear-gradient(to right, #ffffff, #e0f7fa)';
    }
  }

  function showAchievement(msg) {
    achievementDiv.textContent = msg;
    achievementDiv.classList.add('show');
    setTimeout(() => {
      achievementDiv.classList.remove('show');
    }, 4000);
  }

  function updateRank(winCount) {
    let rank = '';
    if (winCount >= 20) rank = 'じゃんけんマスター👑';
    else if (winCount >= 15) rank = 'じゃんけん達人🔥';
    else if (winCount >= 10) rank = 'じゃんけん上級者✨';
    else if (winCount >= 5) rank = 'じゃんけん中級者😊';
    else if (winCount >= 3) rank = 'じゃんけん初級者';
    else rank = '';
    rankDiv.textContent = rank;
  }

  function disableButtons(disabled) {
    buttons.forEach(btn => {
      btn.disabled = disabled;
      if (disabled) {
        btn.classList.add('disabled');
      } else {
        btn.classList.remove('disabled');
      }
    });
  }

  function clearResult() {
    resultDiv.textContent = '';
  }

  function saveBestScore() {
    if (winCount > bestScore) {
      bestScore = winCount;
      localStorage.setItem('bestScore', bestScore);
    }
  }

  function showResult(text, isWin, isLose) {
    resultDiv.textContent = text;
    resultDiv.classList.remove('win-effect', 'lose-effect');
    if (isWin) resultDiv.classList.add('win-effect');
    if (isLose) resultDiv.classList.add('lose-effect');
  }

  function clearRetryButton() {
    retryBtn.style.display = 'none';
  }

  function resetGame() {
    winCount = 0;
    updateBackground(winCount);
    updateRank(winCount);
    scoreDiv.textContent = `最高連勝記録: ${bestScore}`;
    resultDiv.textContent = '';
    retryBtn.style.display = 'none';
    disableButtons(false);
  }

  function onHandClick(e) {
    const playerHand = e.currentTarget.dataset.hand;
    disableButtons(true);
    playSound(clickSound);
    
    const computerHand = hands[Math.floor(Math.random() * hands.length)];
    const judgeResult = judge(playerHand, computerHand);

    let resultText = `あなた：${playerHand} / コンピューター：${computerHand} → `;

    if (judgeResult === '勝ち') {
      winCount++;
      resultText += 'あなたの勝ち！🎉';
      playSound(winSound);
      showResult(resultText, true, false);
    } else if (judgeResult === '負け') {
      resultText += 'あなたの負け...😢';
      playSound(loseSound);
      showResult(resultText, false, true);
      saveBestScore();
      retryBtn.style.display = 'inline-block';
    } else {
      resultText += 'あいこです。';
      showResult(resultText, false, false);
      disableButtons(false);
    }
    scoreDiv.textContent = `連勝中: ${winCount} / 最高連勝記録: ${bestScore}`;
    updateRank(winCount);
    updateBackground(winCount);

    if (winCount > 0 && winCount % 5 === 0) {
      showAchievement(`🎉 ${winCount}連勝達成！すごい！ 🎉`);
    }
  }

  retryBtn.addEventListener('click', () => {
    resetGame();
  });

  // キーボード操作 (G, C, P)
  window.addEventListener('keydown', (e) => {
    if (retryBtn.style.display !== 'none') return; // リトライ中は無効
    const key = e.key.toUpperCase();
    if (key === 'G') buttons[0].click();
    else if (key === 'C') buttons[1].click();
    else if (key === 'P') buttons[2].click();
  });

  // 初期表示
  resetGame();
})();
