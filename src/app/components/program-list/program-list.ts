import { Component } from '@angular/core';
import { MOCK_PROGRAMS } from '../../data/programs.mock';
import { Program } from '../../models/program.model';
import { ProgramCard } from "../program-card/program-card";
import { SearchBar } from "../search-bar/search-bar";
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, map, Observable } from 'rxjs';
import { FilterButton } from "../filter-button/filter-button";
@Component({
  selector: 'app-program-list',
  imports: [ProgramCard, SearchBar, AsyncPipe, FilterButton],
  templateUrl: './program-list.html',
  styleUrl: './program-list.scss',
})
export class ProgramList {
  private readonly programs: Program[] = MOCK_PROGRAMS;

  selectedfilterButton: string = 'All';

  private search$ = new BehaviorSubject<string>('');
  private filterButton$ = new BehaviorSubject<string>('All');

  private debouncedSearch$ = this.search$.pipe(
    debounceTime(300),
    distinctUntilChanged()
  );

  filteredPrograms$: Observable<Program[]> = combineLatest([
    this.debouncedSearch$,
    this.filterButton$,
  ]).pipe(
    // multiple filters can be applied here
    map(([search, filterButton]) => {
      const searchTerm = search.trim().toLowerCase();

      return this.programs.filter(program => {
        const matchesSearch =
          !searchTerm ||
          program.programName.toLowerCase().includes(searchTerm) ||
          program.schoolName.toLowerCase().includes(searchTerm);

        const matchesType =
          filterButton === 'All' || program.type === filterButton;

        return matchesSearch && matchesType;
      });
    })
  );

  onSearch(value: string) {
    this.search$.next(value);
  }

  onFilterButtonClick(value: string) {
    this.selectedfilterButton = value;
    this.filterButton$.next(value);
  }
}
