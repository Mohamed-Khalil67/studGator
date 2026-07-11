import { Component } from '@angular/core';
import { MOCK_PROGRAMS } from '../../data/programs.mock';
import { Program } from '../../models/program.model';
import { ProgramCard } from "../program-card/program-card";
import { SearchBar } from "../search-bar/search-bar";
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, debounceTime, distinctUntilChanged, map, Observable } from 'rxjs';
@Component({
  selector: 'app-program-list',
  imports: [ProgramCard, SearchBar, AsyncPipe],
  templateUrl: './program-list.html',
  styleUrl: './program-list.scss',
})
export class ProgramList {
  private readonly programs: Program[] = MOCK_PROGRAMS;

  private search$ = new BehaviorSubject<string>('');

  filteredPrograms$: Observable<Program[]> = this.search$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    map((searchTerm) => {
      const q = searchTerm.trim().toLowerCase();
      if (!q) return this.programs; // default return all programs if search term is empty
      return this.programs.filter(program =>
        program.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.schoolName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
  );

  onSearch(value: string) {
    this.search$.next(value);
  }
}
