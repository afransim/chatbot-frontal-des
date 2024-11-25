import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonModule, FormsModule, InputGroupModule, InputGroupAddonModule, InputTextModule, TranslateModule],
  animations: [
    trigger('rotate', [
      state('down', style({ transform: 'rotate(0)' })),
      state('up', style({ transform: 'rotate(180deg)' })),
      transition('down <=> up', animate('150ms ease-in'))
    ])
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  selectedLanguage = 'ES';
  dropdownOpen = false;
  languages = [
  { name: 'Català', value: 'CA' },
  { name: 'Castellano', value: 'ES' },
  { name: 'English', value: 'EN' }];

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  constructor(private translate: TranslateService) {
    this.selectedLanguage = this.languages[0].value;
  }

  changeLanguage(lang: string) {
    this.selectedLanguage = lang;
    this.translate.use(lang);
    this.toggleDropdown();
  }

}
