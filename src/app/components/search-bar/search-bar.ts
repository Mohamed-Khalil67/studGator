import { Component, output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  imports: [],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar {
  searchChange = output<string>();

  onInput(value: string) {
    this.searchChange.emit(value);
  }
}
