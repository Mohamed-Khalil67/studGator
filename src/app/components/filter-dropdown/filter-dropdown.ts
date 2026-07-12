import { Component, ElementRef, HostListener, inject, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-filter-dropdown',
  imports: [],
  templateUrl: './filter-dropdown.html',
  styleUrl: './filter-dropdown.scss',
})
export class FilterDropdown {
  private el = inject(ElementRef);

  label = input.required<string>();
  options = input<string[]>([]);
  selected = output<string[]>();

  isOpen = signal(false);
  selectedOptions = signal<Set<string>>(new Set());

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.isOpen() && !this.el.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  toggle() {
    this.isOpen.update(open => !open);
  }

  toggleOption(option: string) {
    const set = new Set(this.selectedOptions());
    set.has(option) ? set.delete(option) : set.add(option);
    this.selectedOptions.set(set);
    this.selected.emit([...set]);
  }

  isSelected(option: string): boolean {
    return this.selectedOptions().has(option);
  }

  clear() {
    this.selectedOptions.set(new Set());
    this.selected.emit([]);
  }
}
