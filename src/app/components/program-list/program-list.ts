import { Component, viewChildren } from '@angular/core';
import { MOCK_PROGRAMS } from '../../data/programs.mock';
import { Program } from '../../models/program.model';
import { ProgramCard } from "../program-card/program-card";
import { SearchBar } from "../search-bar/search-bar";
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, map, Observable } from 'rxjs';
import { FilterButton } from "../filter-button/filter-button";
import { FilterDropdown } from "../filter-dropdown/filter-dropdown";
@Component({
  selector: 'app-program-list',
  imports: [ProgramCard, SearchBar, AsyncPipe, FilterButton, FilterDropdown],
  templateUrl: './program-list.html',
  styleUrl: './program-list.scss',
})
export class ProgramList {
  private readonly programs: Program[] = MOCK_PROGRAMS;

  // THE fetched data, cached so we don't re-hit the API on every filter change
  // private programs$: Observable<Program[]> =
  //   this.programService.getPrograms().pipe(
  //     shareReplay({ bufferSize: 1, refCount: false })
  //   );
  // This is the root change.Everything else follows from it.programs(a plain array) becomes programs$(an observable).
  // shareReplay is added so the HTTP call fires once and is replayed to every subscriber, instead of one request per subscriber.

  private dropdownRefs = viewChildren(FilterDropdown);

  selectedfilterButton: string = '';

  private search$ = new BehaviorSubject<string>('');
  private filterButton$ = new BehaviorSubject<string>('All');

  private debouncedSearch$ = this.search$.pipe(
    debounceTime(300),
    distinctUntilChanged()
    // distrinct until changed , ignore if the value didn't actually change / basically also skip duplicates
    // wait for a 300 ms pause in typing 
  );

  private buildRankMap(): Map<number, number> { // this will dissapear when api is implemented, because the api will return the rank of each program
    const map = new Map<number, number>();
    this.programs
      .filter(p => p.type === 'School')
      .sort((a, b) => b.rating - a.rating)
      .forEach((p, i) => map.set(p.id, i + 1));
    return map;
  }

  private rankMap = this.buildRankMap();

  // API version — can't run until data arrives, so it derives from programs$
  // private rankMap$ = this.programs$.pipe(
  //   map(programs => { /* same build logic, but on the emitted programs */ })
  // );

  private optionsFor(key: keyof Program): string[] {
    return [...new Set(this.programs.map(p => String(p[key])))];   // no 'All'
  }
  // new Set(...)
  // A Set is a JavaScript collection that automatically throws away duplicates. Feed it that messy list and it keeps only the unique ones:
  // Set { 'France', 'Spain', 'Germany', 'Italy', 'Netherlands' }

  private readonly filterKeys = [
    { key: 'country' as keyof Program, label: 'Country' },
    { key: 'schoolName' as keyof Program, label: 'School' },
    { key: 'category' as keyof Program, label: 'Field of Study' },
    { key: 'city' as keyof Program, label: 'City' },
    { key: 'currentLevel' as keyof Program, label: 'Current Level' },
    { key: 'intake' as keyof Program, label: 'Intake' },
    { key: 'duration' as keyof Program, label: 'Duration' },
    { key: 'language' as keyof Program, label: 'Program Language' },
  ];

  readonly dropdowns = this.filterKeys.map(d => ({ ...d, options: this.optionsFor(d.key) }));

  // API version — derives from programs$
  // dropdowns$ = this.programs$.pipe(
  //   map(programs => this.filterKeys.map(d => ({
  //     ...d,
  //     options: [...new Set(programs.map(p => String(p[d.key])))]
  //   })))
  // );
  //  Given a field name (like 'country'), it:
  // this.programs.map(p => String(p[key])) → pulls that field off every program → ['France','Spain','France','Germany','Spain'] (with duplicates)
  // new Set(...) → throws away duplicates → {'France','Spain','Germany'}
  // [...] → spreads back into an array → ['France','Spain','Germany']

  private dropdownFilters$ = new BehaviorSubject<Record<string, string[]>>({});


  // API version — 5 sources; data comes THROUGH the stream
  // combineLatest([ programs$, debouncedSearch$, filterButton$, dropdownFilters$, rankMap$ ])
  //   .pipe(map(([programs, search, filterButton, dropdowns, rankMap]) => {
  //      const result = programs.filter(...)        // from the stream
  //      ... rankMap.get(...)                        // from the stream
  //   }))

  filteredPrograms$: Observable<Program[]> = combineLatest([
    this.debouncedSearch$,
    this.filterButton$,
    this.dropdownFilters$
  ]).pipe(
    // multiple filters can be applied here
    map(([search, filterButton, dropdowns]) => {
      const searchTerm = search.trim().toLowerCase();

      const result = this.programs.filter(program => {
        const matchesSearch =
          !searchTerm ||
          program.programName.toLowerCase().includes(searchTerm) ||
          program.schoolName.toLowerCase().includes(searchTerm);

        const matchesType =
          filterButton === 'All' || program.type === filterButton;

        const matchesDropdowns = Object.entries(dropdowns).every(([key, values]) =>
          values.length === 0 || values.includes(String(program[key as keyof Program]))
        );

        return matchesSearch && matchesType && matchesDropdowns;
      });
      if (filterButton === 'All' || filterButton === 'School') {
        return result.sort((a, b) => {
          const rankA = this.rankMap.get(a.id) ?? Infinity;
          const rankB = this.rankMap.get(b.id) ?? Infinity;
          return rankA - rankB;
          // nullish coalescing operator, ?? only falls back on nullish (null or undefined) values.
          // || falls back on any falsy value (including 0 or "").
        });
      }
      return result;
    })
  );

  onSearch(value: string) {
    this.search$.next(value);
  }

  onFilterButtonClick(value: string) {
    this.selectedfilterButton = value;
    this.filterButton$.next(value);
  }

  rankOf(program: Program): number {
    return this.rankMap.get(program.id) ?? 0;
  }

  clearFilters() {
    this.selectedfilterButton = 'All';
    this.filterButton$.next('All');
    this.dropdownFilters$.next({});
    this.dropdownRefs().forEach(dd => dd.clear());
  }

  onDropdownSelect(key: string, value: string[]) {
    this.dropdownFilters$.next({ ...this.dropdownFilters$.value, [key]: value });
  }
}
