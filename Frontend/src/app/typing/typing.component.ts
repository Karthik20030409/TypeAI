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

    this.configureTimedSettings();
    this.loadSentence();

    setTimeout(() => {
      this.sentenceBox?.nativeElement.scrollTo({ top: 0 });
    });
  }

  private configureTimedSettings() {
    if (this.gameMode !== 'timed') return;

    this.totalTime =
      this.timedLevel === 'easy' ? 60 :
      this.timedLevel === 'medium' ? 90 : 120;

    this.timeLeft = this.totalTime;
  }

  private getRequiredCharCount(): number {
    if (this.gameMode !== 'timed') return 600;
    if (this.timedLevel === 'easy') return 350;
    if (this.timedLevel === 'medium') return 550;
    return 800;
  }

  private loadSentence() {
    const minChars = this.getRequiredCharCount();

    this.typingService.generateText('easy').subscribe({
      next: res => {
        let text = res.text;
        while (text.length < minChars) {
          text += ' ' + res.text;
        }

        this.sentence = text.trim();
        this.letters = this.sentence.split('').map(c => ({
          char: c,
          status: 'pending'
        }));
      },
      error: err => console.error(err)
    });
  }

  updateModeDescription() {
    const map: Record<GameMode, string> = {
      timed: '⏱️ Timed Mode — Speed + accuracy under pressure.',
      zen: '🧘 Zen Mode — No limits. Calm and continuous typing.',
      threeMistakes: '🎯 3 Mistakes — Three errors and you are out.',
      suddenDeath: '⚡ Sudden Death — One mistake ends it all.',
      accuracy: '🎯 Accuracy Mode — No timer. Finish with precision.'
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

  private scrollToActiveLetter() {
    const container = this.sentenceBox?.nativeElement;
    const active = container?.children[this.index] as HTMLElement;
    if (!container || !active) return;

    const bottom = active.offsetTop + active.offsetHeight;
    if (bottom > container.scrollTop + container.clientHeight - 20) {
      container.scrollTo({
        top: bottom - container.clientHeight + 40,
        behavior: 'smooth'
      });
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKey(event: KeyboardEvent) {

    if (this.finished) return;

    // 🚫 PREVENT BROWSER SCROLL ON SPACE
    if (event.key === ' ') {
      event.preventDefault();
    }

    if (this.gameMode === 'timed') {
      this.startTimer();
    }

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

    const typed = event.key;
    const expected = current.char;

    if (typed.toLowerCase() === expected.toLowerCase()) {
      current.status = 'correct';
    } else {
      current.status = 'wrong';
      this.mistakes++;

      if (
        this.gameMode === 'suddenDeath' ||
        (this.gameMode === 'threeMistakes' && this.mistakes >= 3)
      ) {
        this.finishTest();
        return;
      }
    }

    this.index++;

    // ✅ Scroll ONLY if NOT space
    if (expected !== ' ') {
      this.scrollToActiveLetter();
    }

    if (this.index === this.letters.length && this.gameMode !== 'zen') {
      this.finishTest();
    }
  }

  finishTest() {
    if (this.finished) return;
    this.finished = true;
    clearInterval(this.interval);
  }

  get accuracy() {
    return this.index === 0 ? 0 :
      Math.round(((this.index - this.mistakes) / this.index) * 100);
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
