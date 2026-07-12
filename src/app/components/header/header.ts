import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private el = inject(ElementRef);
  isMenuOpen = signal(false);

  toggleMenu(): void {
    this.isMenuOpen.update(open => !open);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.isMenuOpen() && !this.el.nativeElement.contains(event.target)) {
      this.isMenuOpen.set(false);
    }
  }
}
