import {
  Component,
  HostListener,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

@Component({
  selector: 'app-typing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './typing.component.html',
  styleUrls: ['./typing.component.css'],
})
export class TypingComponent implements OnInit, OnDestroy {

  difficulty: Difficulty = 'easy';

  timeMap: Record<Difficulty, number> = {
    easy: 60,
    medium: 90,
    hard: 120,
    expert: 180,
  };

  timeLeft = 0;
  timerStarted = false;
  interval: any;

  // ✅ CLEAN TEXT — NO PUNCTUATION — NO LINE BREAKS
  sentences = [
    'typing fast requires calm hands steady focus and daily practice accuracy builds speed and consistency builds mastery',

    'improving typing skill comes from patience repetition and discipline smooth rhythm develops naturally over time',

    'true speed is achieved when accuracy becomes automatic relaxed hands produce reliable results every single time',
  ];

  sentence = '';
  letters: {
    char: string;
    status: 'pending' | 'correct' | 'wrong';
  }[] = [];

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
    this.timeLeft = this.timeMap[this.difficulty];
    this.timerStarted = false;
    this.finished = false;
    this.index = 0;
    this.mistakes = 0;

    // ✅ pick sentence & normalize spaces
    this.sentence = this.sentences[
      Math.floor(Math.random() * this.sentences.length)
    ].replace(/\s+/g, ' ').trim();

    this.letters = this.sentence.split('').map(char => ({
      char,
      status: 'pending',
    }));
  }

  startTimer() {
    if (this.timerStarted) return;
    this.timerStarted = true;

    this.interval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        clearInterval(this.interval);
        this.finishTest();
      }
    }, 1000);
  }

  finishTest() {
    this.finished = true;
  }

  get accuracy(): number {
    const typed = this.index;
    if (typed === 0) return 0;
    const correct = typed - this.mistakes;
    return Math.round((correct / typed) * 100);
  }

  get completion(): number {
    return Math.round((this.index / this.letters.length) * 100);
  }

  @HostListener('window:keydown', ['$event'])
  handleKey(event: KeyboardEvent) {
    if (this.finished) return;
    if (this.timeLeft <= 0) return;

    this.startTimer();

    // ✅ BACKSPACE FIX (perfect UX)
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

    if (event.key === current.char) {
      current.status = 'correct';
    } else {
      current.status = 'wrong';
      this.mistakes++;
    }

    this.index++;
  }
}
