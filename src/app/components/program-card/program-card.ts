import { Component, computed, input } from '@angular/core';
import { Program } from '../../models/program.model';

@Component({
  selector: 'app-program-card',
  imports: [],
  templateUrl: './program-card.html',
  styleUrl: './program-card.scss',
})
export class ProgramCard {
  program = input.required<Program>();
  rank = input<number>(0);

  topLabel = computed(() => {
    const r = this.rank();
    if (r <= 0) return null;
    if (r <= 5) return 'Top 5';
    if (r <= 10) return 'Top 10';
    return null;
  });

}
