import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-filter-button',
  imports: [],
  templateUrl: './filter-button.html',
  styleUrl: './filter-button.scss',
})
export class FilterButton {
  label = input<string>();
  active = input<boolean>();
  clicked = output<void>();
}
