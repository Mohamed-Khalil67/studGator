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

  private dropdownRefs = viewChildren(FilterDropdown);

  selectedfilterButton: string = '';

  private search$ = new BehaviorSubject<string>('');
  private filterButton$ = new BehaviorSubject<string>('All');

  private debouncedSearch$ = this.search$.pipe(
    debounceTime(300),
    distinctUntilChanged()
  );

  private rankMap = this.buildRankMap();

  private buildRankMap(): Map<number, number> {
    const map = new Map<number, number>();
    this.programs
      .filter(p => p.type === 'School')
      .sort((a, b) => b.rating - a.rating)
      .forEach((p, i) => map.set(p.id, i + 1));
    return map;
  }

  private optionsFor(key: keyof Program): string[] {
    return [...new Set(this.programs.map(p => String(p[key])))];   // no 'All'
  }

  private readonly filterKeys = [
    { key: 'country' as keyof Program, label: 'Country' },
    { key: 'schoolName' as keyof Program, label: 'School' },
    { key: 'category' as keyof Program, label: 'Field of Study' },
    { key: 'city' as keyof Program, label: 'City' },
    { key: 'currentLevel' as keyof Program, label: 'Current Level' },
    { key: 'intake' as keyof Program, label: 'Intake' },
    { key: 'durationYears' as keyof Program, label: 'Duration' },
    { key: 'language' as keyof Program, label: 'Program Language' },
  ];

  readonly dropdowns = this.filterKeys.map(d => ({ ...d, options: this.optionsFor(d.key) }));

  private dropdownFilters$ = new BehaviorSubject<Record<string, string[]>>({});

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
