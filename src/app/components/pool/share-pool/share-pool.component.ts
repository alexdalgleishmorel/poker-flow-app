import { Component } from '@angular/core';
import { Clipboard } from '@capacitor/clipboard';
import { PoolService } from 'src/app/services/pool/pool.service';

@Component({
  selector: 'app-share-pool',
  templateUrl: './share-pool.component.html',
  styleUrls: ['./share-pool.component.scss'],
})
export class SharePoolComponent {
  public copied: boolean = false;

  constructor(private poolService: PoolService) {}
  
  writePoolIDToClipboard(id: string) {
    navigator.clipboard ? Clipboard.write({ string: id }) : legacyWritePoolIDToClipboard(id);
    this.copied = true;
    setTimeout(() => {
      this.copied = false;
    }, 3000);
  };

  copyPoolID() {
    this.writePoolIDToClipboard(this.poolService.currentPoolSubject.getValue().id);
  }
}

function legacyWritePoolIDToClipboard(id: string) {
  const textarea = document.createElement('textarea');
  textarea.value = id;
  
  // Avoid scrolling to bottom
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.position = "fixed";

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    const successful = document.execCommand('copy');
    if (!successful) {
      console.error('Failed to copy text.');
    }
  } catch (err) {
    console.error('Error in copying text: ', err);
  }

  document.body.removeChild(textarea);
}
