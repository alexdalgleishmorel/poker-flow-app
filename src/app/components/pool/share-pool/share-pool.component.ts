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

  /**
   * Writes the current pool ID to the user clipboard
   */
  writePoolIDToClipboard() {
    const id = this.poolService.currentPoolSubject.getValue().id;
    navigator.clipboard ? Clipboard.write({string: id}) : legacyWritePoolIDToClipboard(id);
    this.copied = true;
    setTimeout(() => {
      this.copied = false;
    }, 3000);
  };
}

/**
 * Writes to the clipboard using a temporary field and the deprecated document.execCommand function.
 * Should only be used in the event that navigator.clipboard is unavailable (localhost and http).
 * 
 * @param {string} id The ID to write to the clipboard
 */
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
