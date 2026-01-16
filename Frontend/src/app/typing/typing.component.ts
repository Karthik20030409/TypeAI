import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

@Component({
  selector: 'app-typing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="typing-app">
      <div class="info-panel">
        <h2>Typing <span>Test</span></h2>
        <p>Start typing to measure speed</p>
        <div class="timer">60s</div>
      </div>

      <div class="typing-panel">
        <div class="sentence">
          <span class="pending">Start typing here...</span>
        </div>
        <div class="hint">Press Esc to exit</div>
      </div>
    </div>
  `,
  styleUrls: ['./typing.component.css'],
})
export class TypingComponent implements OnInit {

  difficulty: Difficulty = 'easy';

  timeMap = {
    easy: 30,
    medium: 45,
    hard: 60,
    expert: 120,
  };

  timeLeft = 0;
  timerStarted = false;
  interval: any;

  sentences = [
    'Typing fast requires accuracy and rhythm',
    'Practice daily to improve muscle memory',
    'Speed comes naturally with consistency',
    'Focus on accuracy before increasing speed',
    'Great typists make fewer mistakes',
  ];

  sentence = '';
  letters: { char: string; status: 'pending' | 'correct' | 'wrong' }[] = [];
  index = 0;

  ngOnInit() {
    this.startGame();
  }

  startGame() {
    this.timeLeft = this.timeMap[this.difficulty];
    this.timerStarted = false;
    this.index = 0;

    this.sentence =
      this.sentences[Math.floor(Math.random() * this.sentences.length)];

    this.letters = this.sentence.split('').map(c => ({
      char: c,
      status: 'pending',
    }));
  }

  startTimer() {
    if (this.timerStarted) return;
    this.timerStarted = true;

    this.interval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft === 0) clearInterval(this.interval);
    }, 1000);
  }

  @HostListener('window:keydown', ['$event'])
  handleKey(e: KeyboardEvent) {
    if (this.timeLeft <= 0) return;
    if (e.key.length !== 1) return;

    this.startTimer();

    const expected = this.letters[this.index];
    if (!expected) return;

    expected.status = e.key === expected.char ? 'correct' : 'wrong';
    this.index++;
  }
}
