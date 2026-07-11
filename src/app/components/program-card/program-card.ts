import { Component, input } from '@angular/core';
import { Program } from '../../models/program.model';

@Component({
  selector: 'app-program-card',
  imports: [],
  templateUrl: './program-card.html',
  styleUrl: './program-card.scss',
})
export class ProgramCard {
  program = input.required<Program>()
}
