import {
  Component,
  HostListener,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypingService } from '../Services/typing.service';

type Difficulty = 'easy' | 'medium' | 'hard';
type GameMode = 'timed' | 'zen' | 'threeMistakes' | 'suddenDeath';
type TimedLevel = 'easy' | 'medium' | 'hard';

@Component({
  selector: 'app-typing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './typing.component.html',
  styleUrls: ['./typing.component.css'],
})
export class TypingComponent implements OnInit, OnDestroy {

  constructor(private typingService: TypingService) {}

  @ViewChild('sentenceBox') sentenceBox!: ElementRef<HTMLDivElement>;

  difficulty: Difficulty = 'easy';
  gameMode: GameMode = 'timed';
  timedLevel: TimedLevel = 'easy';

  totalTime = 60;
  timeLeft = 60;
  timerStarted = false;
  interval: any;

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

  startGame() {
    clearInterval(this.interval);

    this.index = 0;
    this.mistakes = 0;
    this.finished = false;
    this.timerStarted = false;

    if (this.gameMode === 'timed') {
      this.totalTime =
        this.timedLevel === 'easy' ? 60 :
        this.timedLevel === 'medium' ? 90 : 120;
      this.timeLeft = this.totalTime;
    } else {
      this.totalTime = 0;
      this.timeLeft = 0;
    }

    this.typingService.generateText(this.difficulty).subscribe({
      next: res => {
        this.sentence = res.text;
        this.letters = this.sentence.split('').map(c => ({
          char: c,
          status: 'pending'
        }));
      },
      error: err => console.error(err)
    });
  }

  startTimer() {
    if (this.timerStarted || this.gameMode !== 'timed') return;

    this.timerStarted = true;
    this.interval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) this.finishTest();
    }, 1000);
  }

  @HostListener('window:keydown', ['$event'])
  handleKey(event: KeyboardEvent) {
    if (this.finished) return;

    if (event.key === ' ') event.preventDefault();
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

    if (event.key.toLowerCase() === current.char.toLowerCase()) {
      current.status = 'correct';
    } else {
      current.status = 'wrong';
      this.mistakes++;

      if (this.gameMode === 'suddenDeath') return this.finishTest();
      if (this.gameMode === 'threeMistakes' && this.mistakes >= 3)
        return this.finishTest();
    }

    this.index++;
    this.autoScroll();

    if (this.index === this.letters.length) this.finishTest();
  }

  autoScroll() {
    requestAnimationFrame(() => {
      const container = this.sentenceBox.nativeElement;
      const active = container.querySelector('.active') as HTMLElement;
      if (!active) return;

      const top = active.offsetTop;
      const bottom = top + active.offsetHeight;

      if (top < container.scrollTop) {
        container.scrollTop = top - 20;
      } else if (bottom > container.scrollTop + container.clientHeight) {
        container.scrollTop = bottom - container.clientHeight + 20;
      }
    });
  }

  finishTest() {
    if (this.finished) return;
    this.finished = true;
    clearInterval(this.interval);
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
    return this.gameMode === 'timed'
      ? this.totalTime - this.timeLeft
      : 0;
  }

  setDifficulty(level: Difficulty) {
    this.difficulty = level;
    this.startGame();
  }

  setGameMode(mode: GameMode) {
    this.gameMode = mode;
    this.startGame();
  }

  setTimedLevel(level: TimedLevel) {
    this.timedLevel = level;
    this.startGame();
  }
}
