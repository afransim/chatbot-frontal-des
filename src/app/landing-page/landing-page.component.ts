import { ChangeDetectorRef, Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { ApiService } from '../app.service';
import { TokenService } from '../token.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

interface SelectedDocument {
  name: string;
  value: string;
}

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, ButtonModule, FormsModule, InputGroupModule,
  InputGroupAddonModule, InputTextModule, TranslateModule, DropdownModule, ProgressSpinnerModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
  encapsulation: ViewEncapsulation.None
})
export class LandingPageComponent {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  searchInput: string = '';
  messages: { content: string, role: 'user' | 'assistant' }[] = [];
  loading: boolean = false;

  documents: any[] | undefined;
  attachedDocuments: File[] = [];
  selectedDocument?: SelectedDocument;

  constructor(private cdr: ChangeDetectorRef, private service: ApiService, 
    private tokenService: TokenService, private translateService: TranslateService) { }

  ngOnInit(): void {
    this.tokenService.generateToken().subscribe({
      next: (token: any) => {
        this.tokenService.storeToken(token.access_token);
        this.service.getDocumentList().subscribe({
          next: (data: any) => {
            this.documents = data;
          },
          error: (error) => {
            console.error('Error getting document list: ', error);
          }
        });
      },
      error: (error) => {
        console.error('Error generating token: ', error);
      }
    });
  }

  

  send(event?: any) {
    if (event) {
      event.preventDefault();
    }
    if (this.searchInput && !this.loading) {
      if (this.searchInput.trim() !== '') {
        this.loading = true;
        this.messages.push({ content: this.searchInput, role: 'user' });
        // Remove first messages if length above 10
        while (this.messages.length > 10) {
          this.messages.shift(); 
        }
        this.service.chatbotSend(this.messages, this.selectedDocument?.name).subscribe((response) => {
          this.loading = false;
          // Change new line characters to <br> for display
          const newResponse = response.replace(/\n/g, '<br>');
          this.messages.push({ content: newResponse, role: 'assistant' });
          this.scrollToBottom();
        },
      () => {
        setTimeout(() => {
          this.loading = false;
          this.messages.push({ content: this.translateService.instant('error-communication'), role: 'assistant' });
          this.scrollToBottom();
        }, 1000);
      });
        this.searchInput = '';
      }
    }
  }

  onFileSelected(event: any): void {
    this.attachedDocuments = [];
    const fileInput = event.target;
    const file: File = fileInput.files[0];
    const allowedFormats = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (file && allowedFormats.includes(file.type) && !this.attachedDocuments.some(doc => doc.name === file.name)) {
      this.attachedDocuments.push(file);
      this.selectedDocument = undefined;
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const fileContent = event.target.result as ArrayBuffer;
        this.service.uploadFile(fileContent, file.name).subscribe(data => {
          console.log('File uploaded');
        },
        (error) => {
          console.error('Error uploading file', error);
        });
        
      }
      reader.readAsArrayBuffer(file);
    } else {
      alert('Invalid file format. Please select a PDF, DOC, or DOCX file.');
    }
    fileInput.value = '';
  }

  removeDocument(doc: File): void {
    const index = this.attachedDocuments.indexOf(doc);
    if (index > -1) {
      this.attachedDocuments.splice(index, 1);
    }
  }

  attach() {
    this.fileInput.nativeElement.click();
  }

  mockBotReply() {
    setTimeout(() => {
      this.messages.push({ content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum varius odio tortor. Mauris in felis sed magna consequat porta. Mauris porta varius magna, et pharetra tortor consectetur ac. Morbi fermentum mattis viverra. Etiam vitae nibh erat. Nam ac fringilla orci. Ut finibus elit nec diam tincidunt, et viverra mauris consequat. Aliquam erat volutpat.', role: 'assistant' });
      this.scrollToBottom();
    }, 1000);
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    this.cdr.detectChanges();
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error scrolling to bottom', err);
    }
  }
}
