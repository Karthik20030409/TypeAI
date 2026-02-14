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

type GameMode =
  | 'timed'
  | 'zen'
  | 'threeMistakes'
  | 'suddenDeath'
  | 'endless'
  | 'accuracy';

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

  modeDescription = '';

  ngOnInit() {
    this.updateModeDescription();
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
    }

    this.typingService.generateText('easy').subscribe({
      next: res => {
        this.sentence = res.text;
        this.letters = this.sentence.split('').map(c => ({
          char: c,
          status: 'pending'
        }));

        // Reset scroll to top
        setTimeout(() => {
          this.sentenceBox?.nativeElement.scrollTo({ top: 0 });
        });
      },
      error: err => console.error(err)
    });
  }

  updateModeDescription() {
    const map: Record<GameMode, string> = {
      timed: '⏱️ Timed Mode — Race against time. Speed + consistency wins.',
      zen: '🧘 Zen Mode — No pressure. Type endlessly with calm focus.',
      threeMistakes: '🎯 3 Mistakes — Precision challenge. Three errors and it ends.',
      suddenDeath: '⚡ Sudden Death — One mistake = instant game over.',
      endless: '♾️ Endless — Infinite text. Train stamina and flow.',
      accuracy: '🎯 Accuracy Mode — No timer. Finish the text with maximum precision.'
    };
    this.modeDescription = map[this.gameMode];
  }

  startTimer() {
    if (this.timerStarted || this.gameMode !== 'timed') return;

    this.timerStarted = true;
    this.interval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) this.finishTest();
    }, 1000);
  }

  // 🔥 AUTO SCROLL LOGIC (THE FIX)
  private scrollToActiveLetter() {
    if (!this.sentenceBox) return;

    const container = this.sentenceBox.nativeElement;
    const activeSpan = container.children[this.index] as HTMLElement;

    if (!activeSpan) return;

    const spanTop = activeSpan.offsetTop;
    const spanBottom = spanTop + activeSpan.offsetHeight;

    const viewTop = container.scrollTop;
    const viewBottom = viewTop + container.clientHeight;

    if (spanBottom > viewBottom - 20) {
      container.scrollTo({
        top: spanBottom - container.clientHeight + 40,
        behavior: 'smooth'
      });
    }

    if (spanTop < viewTop + 20) {
      container.scrollTo({
        top: spanTop - 20,
        behavior: 'smooth'
      });
    }
  }

  // 🔥 KEYBOARD HANDLING
  @HostListener('window:keydown', ['$event'])
  handleKey(event: KeyboardEvent) {

    if (event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
    }

    const target = event.target as HTMLElement;
    if (
      target.tagName === 'BUTTON' ||
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA'
    ) {
      return;
    }

    if (this.finished) return;

    if (this.gameMode === 'timed') {
      this.startTimer();
    }

    // BACKSPACE
    if (event.key === 'Backspace') {
      if (this.index > 0) {
        this.index--;
        this.letters[this.index].status = 'pending';
        this.scrollToActiveLetter();
      }
      return;
    }

    if (event.key.length !== 1) return;

    const current = this.letters[this.index];
    if (!current) return;

    if (event.key === current.char) {
      current.status = 'correct';
    } else {
      current.status = 'wrong';
      this.mistakes++;

      if (this.gameMode === 'suddenDeath') {
        this.finishTest();
        return;
      }

      if (this.gameMode === 'threeMistakes' && this.mistakes >= 3) {
        this.finishTest();
        return;
      }
    }

    this.index++;
    this.scrollToActiveLetter();

    if (this.index === this.letters.length) {
      if (this.gameMode !== 'endless') {
        this.finishTest();
      }
    }
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

  setGameMode(mode: GameMode) {
    this.gameMode = mode;
    this.updateModeDescription();
    this.startGame();
  }

  setTimedLevel(level: TimedLevel) {
    this.timedLevel = level;
    this.startGame();
  }
}
