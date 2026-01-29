import {
  Component,
  HostListener,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
//import { TypingService } from '../Services/typing.service';

type Difficulty = 'easy' | 'medium' | 'hard';

@Component({
  selector: 'app-typing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './typing.component.html',
  styleUrls: ['./typing.component.css'],
})
export class TypingComponent implements OnInit, OnDestroy {

  //constructor(private typingService: TypingService) {}

  @ViewChild('sentenceBox') sentenceBox!: ElementRef<HTMLDivElement>;

  difficulty: Difficulty = 'easy';

  timeLeft = 0;
  totalTime = 0;
  timerStarted = false;
  interval: any;

  sentence = '';
  letters: { char: string; status: 'pending' | 'correct' | 'wrong' }[] = [];

  index = 0;
  mistakes = 0;
  finished = false;

  /* ================= LIFECYCLE ================= */

  ngOnInit() {
    this.startGame();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  /* ================= GAME SETUP ================= */

  startGame() {
    clearInterval(this.interval);

    this.timerStarted = false;
    this.finished = false;
    this.index = 0;
    this.mistakes = 0;

    const pool = [
      'focus','discipline','clarity','control','precision','growth',
      'momentum','confidence','flow','patience','mastery','calm'
    ];

    const wordCount =
      this.difficulty === 'easy' ? 30 :
      this.difficulty === 'medium' ? 70 : 120;

    this.totalTime =
      this.difficulty === 'easy' ? 45 :
      this.difficulty === 'medium' ? 75 : 120;

    this.timeLeft = this.totalTime;

    this.sentence = Array.from({ length: wordCount }, () =>
      pool[Math.floor(Math.random() * pool.length)]
    ).join(' ');

    this.letters = this.sentence.split('').map(c => ({
      char: c,
      status: 'pending'
    }));
  }

  /* ================= TIMER ================= */

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

  /* ================= FINISH ================= */

  finishTest() {
    if (this.finished) return;

    this.finished = true;
    clearInterval(this.interval);

    // ✅ API CALL (SERVICE)
    // this.typingService.saveTypingResult({
    //   accuracy: this.accuracy,
    //   completion: this.completion,
    //   timeTaken: this.timeTaken
    // }).subscribe({
    //   next: (res) => console.log('API Success:', res),
    //   error: (err) => console.error('API Error:', err)
    // });
  }

  /* ================= INPUT ================= */

  @HostListener('window:keydown', ['$event'])
  handleKey(event: KeyboardEvent) {

    if (this.finished) return;

    // prevent browser scroll on space
    if (event.key === ' ') event.preventDefault();

    this.startTimer();

    // BACKSPACE
    if (event.key === 'Backspace' && this.index > 0) {
      this.index--;
      this.letters[this.index].status = 'pending';
      this.autoScroll();
      return;
    }

    // ignore non-character keys
    if (event.key.length !== 1) return;

    const current = this.letters[this.index];
    if (!current) return;

    // ✅ NORMALIZED COMPARISON
    const typedChar = event.key.toLowerCase();
    const expectedChar = current.char.toLowerCase();

    if (typedChar === expectedChar) {
      current.status = 'correct';
    } else {
      current.status = 'wrong';
      this.mistakes++;
    }

    this.index++;
    this.autoScroll();

    if (this.index === this.letters.length) {
      this.finishTest();
    }
  }

  /* ================= SCROLL ================= */

  autoScroll() {
    requestAnimationFrame(() => {
      const container = this.sentenceBox?.nativeElement;
      if (!container) return;

      const active = container.querySelector('.active') as HTMLElement;
      if (!active) return;

      active.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    });
  }

  /* ================= METRICS ================= */

  get accuracy() {
    return this.index === 0
      ? 0
      : Math.round(((this.index - this.mistakes) / this.index) * 100);
  }

  get completion() {
    return Math.round((this.index / this.letters.length) * 100);
  }

  get timeTaken() {
    return this.totalTime - this.timeLeft;
  }

  setDifficulty(level: Difficulty) {
    this.difficulty = level;
    this.startGame();
  }
}
