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

  // Need to build a directive that listens for clicks outside the component and closes the dropdown when that happens. This is a common pattern for dropdowns and modals.
  // The @HostListener decorator is used to listen for click events on the document, and if the click is outside the component, it sets isOpen to false.
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
    const setData = new Set(this.selectedOptions());
    setData.has(option) ? setData.delete(option) : setData.add(option);
    this.selectedOptions.set(setData);
    this.selected.emit([...setData]);
  }

  isSelected(option: string): boolean {
    return this.selectedOptions().has(option);
  }

  clear() {
    this.selectedOptions.set(new Set());
    this.selected.emit([]);
  }
}
