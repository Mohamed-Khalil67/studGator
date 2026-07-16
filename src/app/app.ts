import { Component, signal } from '@angular/core';
import { Header } from "./components/header/header";
import { MOCK_PROGRAMS } from './data/programs.mock';
import { ProgramList } from "./components/program-list/program-list";
@Component({
  selector: 'app-root',
  imports: [Header, ProgramList],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  // programs = MOCK_PROGRAMS;
}
