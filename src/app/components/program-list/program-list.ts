import { Component } from '@angular/core';
import { MOCK_PROGRAMS } from '../../data/programs.mock';
import { Program } from '../../models/program.model';
import { ProgramCard } from "../program-card/program-card";
@Component({
  selector: 'app-program-list',
  imports: [ProgramCard],
  templateUrl: './program-list.html',
  styleUrl: './program-list.scss',
})
export class ProgramList {
  programs: Program[] = MOCK_PROGRAMS;
}
