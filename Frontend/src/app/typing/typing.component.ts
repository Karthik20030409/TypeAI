import {
  Component,
  HostListener,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

type Difficulty = 'easy' | 'medium' | 'hard';

@Component({
  selector: 'app-typing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './typing.component.html',
  styleUrls: ['./typing.component.css'],
})
export class TypingComponent implements OnInit, OnDestroy {
   constructor(private router: Router) {}

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

  // 🔐 AUTH STATE
  authMode: 'logged' | 'guest' = 'guest';
  guestLocked = false;

  ngOnInit() {
    
    this.startGame();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

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

  startTimer() {
    if (this.timerStarted) return;
    this.timerStarted = true;

    this.interval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) this.finishTest();
    }, 1000);
  }

  finishTest() {
    if (this.finished) return;
    this.finished = true;
    clearInterval(this.interval);

    // 🔒 Lock guest after first match
    
  }

  @HostListener('window:keydown', ['$event'])
  handleKey(event: KeyboardEvent) {

    if (this.guestLocked) return;
    if (event.key === ' ') event.preventDefault();
    if (this.finished || this.timeLeft <= 0) return;

    this.startTimer();

    if (event.key === 'Backspace' && this.index > 0) {
      this.index--;
      this.letters[this.index].status = 'pending';
      this.autoScroll();
      return;
    }

    if (event.key.length !== 1) return;

    const current = this.letters[this.index];
    if (!current) return;

    current.status = event.key === current.char ? 'correct' : 'wrong';
    if (current.status === 'wrong') this.mistakes++;

    this.index++;
    this.autoScroll();

    if (this.index === this.letters.length) {
      this.finishTest();
    }
  }

  autoScroll() {
    requestAnimationFrame(() => {
      const container = this.sentenceBox.nativeElement;
      const caret = container.querySelector('.caret') as HTMLElement;
      if (!caret) return;

      caret.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    });
  }

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
    if (this.guestLocked) return;
    this.difficulty = level;
    this.startGame();
  }

  restartTest() {
    if (this.authMode === 'guest') {
      alert('Please login to continue');
      this.router.navigate(['/typing']);
      return;
    }
    this.startGame();
  }
}
