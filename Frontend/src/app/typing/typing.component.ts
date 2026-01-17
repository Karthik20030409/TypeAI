import {
  Component,
  HostListener,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

type Difficulty = 'easy' | 'medium' | 'hard';

@Component({
  selector: 'app-typing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './typing.component.html',
  styleUrls: ['./typing.component.css'],
})
export class TypingComponent implements OnInit, OnDestroy {

  difficulty: Difficulty = 'easy';

  timeLeft = 0;
  totalTime = 0;
  timerStarted = false;
  interval: any;

  private wordPool = [
    'typing','speed','accuracy','focus','discipline','practice',
    'calm','hands','rhythm','flow','learning','progress',
    'consistency','skill','improvement','control','confidence',
    'performance','precision','mastery','patience','clarity',
    'attention','growth','stability','momentum'
  ];

  sentence = '';
  letters: { char: string; status: 'pending' | 'correct' | 'wrong' }[] = [];

  index = 0;
  mistakes = 0;
  finished = false;

  ngOnInit() {
    this.startGame();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  /* ---------- HELPERS ---------- */

  private randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private generateSentence(words: number): string {
    const result: string[] = [];
    for (let i = 0; i < words; i++) {
      result.push(
        this.wordPool[Math.floor(Math.random() * this.wordPool.length)]
      );
    }
    return result.join(' ');
  }

  /* ---------- GAME LOGIC ---------- */

  startGame() {
    clearInterval(this.interval);

    this.timerStarted = false;
    this.finished = false;
    this.index = 0;
    this.mistakes = 0;

    let words = 30;

    if (this.difficulty === 'easy') {
      this.totalTime = this.randomBetween(30, 45);
      words = this.randomBetween(25, 40); // 1–3 lines
    }

    if (this.difficulty === 'medium') {
      this.totalTime = this.randomBetween(60, 90);
      words = this.randomBetween(60, 90); // 4–6 lines
    }

    if (this.difficulty === 'hard') {
      this.totalTime = this.randomBetween(90, 120);
      words = this.randomBetween(100, 140); // 6+ lines
    }

    this.timeLeft = this.totalTime;
    this.sentence = this.generateSentence(words);

    this.letters = this.sentence.split('').map(char => ({
      char,
      status: 'pending',
    }));
  }

  /* ---------- TIMER ---------- */

  startTimer() {
    if (this.timerStarted) return;
    this.timerStarted = true;

    this.interval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.finishTest();
      }
    }, 1000);
  }

  finishTest() {
    if (this.finished) return;
    this.finished = true;
    clearInterval(this.interval);
  }

  /* ---------- METRICS ---------- */

  get timeTaken(): number {
    return this.totalTime - this.timeLeft;
  }

  get accuracy(): number {
    if (this.index === 0) return 0;
    return Math.round(((this.index - this.mistakes) / this.index) * 100);
  }

  get completion(): number {
    return Math.round((this.index / this.letters.length) * 100);
  }

  /* ---------- KEY HANDLING ---------- */

  @HostListener('window:keydown', ['$event'])
  handleKey(event: KeyboardEvent) {
    if (this.finished || this.timeLeft <= 0) return;

    this.startTimer();

    if (event.key === 'Backspace') {
      if (this.index > 0) {
        this.index--;
        this.letters[this.index].status = 'pending';
      }
      return;
    }

    if (event.key.length !== 1) return;

    const current = this.letters[this.index];
    if (!current) return;

    current.status =
      event.key === current.char ? 'correct' : 'wrong';

    if (current.status === 'wrong') this.mistakes++;

    this.index++;

    if (this.index === this.letters.length) {
      this.finishTest();
    }
  }
}
