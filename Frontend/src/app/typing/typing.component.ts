import {
  Component,
  HostListener,
  OnInit,
  OnDestroy,
  ViewChildren,
  QueryList,
  ElementRef,
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
  showSettings = false;

  motivationText = '';
  celebrationMessage = '';
  private motivationInterval: any;

  sentence = '';
  letters: { char: string; status: 'pending' | 'correct' | 'wrong' }[] = [];

  index = 0;
  mistakes = 0;
  finished = false;

  caretTransform = 'translate3d(0,0,0)';
  showCelebration = false;

  @ViewChildren('charEl') charElements!: QueryList<ElementRef>;

  ngOnInit() {
    this.startGame();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    clearInterval(this.motivationInterval);
  }

  toggleSettings() {
    this.showSettings = !this.showSettings;
  }

  /* ---------- GAME ---------- */

  startGame() {
    clearInterval(this.interval);
    clearInterval(this.motivationInterval);

    this.timerStarted = false;
    this.finished = false;
    this.index = 0;
    this.mistakes = 0;
    this.motivationText = '';
    this.celebrationMessage = '';
    this.showCelebration = false;

    const wordPool = [
      'focus','discipline','clarity','control','precision','growth',
      'momentum','confidence','flow','patience','mastery','calm'
    ];

    const words =
      this.difficulty === 'easy' ? 30 :
      this.difficulty === 'medium' ? 70 : 120;

    this.totalTime =
      this.difficulty === 'easy' ? 45 :
      this.difficulty === 'medium' ? 75 : 120;

    this.timeLeft = this.totalTime;

    this.sentence = Array.from({ length: words }, () =>
      wordPool[Math.floor(Math.random() * wordPool.length)]
    ).join(' ');

    this.letters = this.sentence.split('').map(c => ({
      char: c,
      status: 'pending',
    }));

    setTimeout(() => this.updateCaret());
  }

  /* ---------- TIMER + MOTIVATION ---------- */

  startTimer() {
    if (this.timerStarted) return;
    this.timerStarted = true;

    this.motivationInterval = setInterval(() => {
      const acc = this.accuracy;
      const speed = this.index / Math.max(this.timeTaken, 1);

      if (acc > 95) {
        this.motivationText = '🔥 Elite precision. Stay locked in.';
      } else if (speed > 4) {
        this.motivationText = '⚡ Fast hands. Calm control.';
      } else if (this.mistakes === 0) {
        this.motivationText = '🎯 Flawless rhythm. Beautiful.';
      } else {
        this.motivationText = '🧠 Slow is smooth. Smooth is fast.';
      }
    }, 5000);

    this.interval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) this.finishTest();
    }, 1000);
  }

  finishTest() {
    if (this.finished) return;
    this.finished = true;

    clearInterval(this.interval);
    clearInterval(this.motivationInterval);

    this.showCelebration = true;

    this.celebrationMessage =
      `🏆 Outstanding work.\n
Accuracy ${this.accuracy}% • Completion ${this.completion}%\n
This is real progress. Run it again and sharpen your edge.`;
  }

  /* ---------- METRICS ---------- */

  get timeTaken() {
    return this.totalTime - this.timeLeft;
  }

  get accuracy() {
    return this.index === 0
      ? 0
      : Math.round(((this.index - this.mistakes) / this.index) * 100);
  }

  get completion() {
    return Math.round((this.index / this.letters.length) * 100);
  }

  /* ---------- KEY HANDLING ---------- */

  @HostListener('window:keydown', ['$event'])
  handleKey(event: KeyboardEvent) {

    if (event.key === ' ') event.preventDefault();
    if (this.finished || this.timeLeft <= 0) return;

    this.startTimer();

    if (event.key === 'Backspace' && this.index > 0) {
      this.index--;
      this.letters[this.index].status = 'pending';
      this.updateCaret();
      return;
    }

    if (event.key.length !== 1) return;

    const current = this.letters[this.index];
    if (!current) return;

    current.status = event.key === current.char ? 'correct' : 'wrong';
    if (current.status === 'wrong') this.mistakes++;

    this.index++;
    this.updateCaret();

    if (this.index === this.letters.length) {
      this.finishTest();
    }
  }

  /* ---------- CARET (PIXEL PERFECT) ---------- */

  updateCaret() {
    requestAnimationFrame(() => {
      const el = this.charElements.get(this.index);
      if (!el) return;

      const node = el.nativeElement as HTMLElement;

      const x = node.offsetLeft;
      const y = node.offsetTop;

      this.caretTransform =
        `translate3d(${x}px, ${y}px, 0)`;
    });
  }
}
