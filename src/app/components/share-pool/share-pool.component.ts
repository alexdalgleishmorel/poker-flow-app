import { Component, OnInit } from '@angular/core';
import { Clipboard } from '@capacitor/clipboard';
import { PoolService } from 'src/app/services/pool/pool.service';

@Component({
  selector: 'app-share-pool',
  templateUrl: './share-pool.component.html',
  styleUrls: ['./share-pool.component.scss'],
})
export class SharePoolComponent implements OnInit {

  public copied: boolean = false;

  constructor(private poolService: PoolService) {
  }

  ngOnInit() {}
  
  writePoolIDToClipboard = async () => {
    await Clipboard.write({
      string: this.poolService.currentPoolID.getValue()
    });
    this.copied = true;
    setTimeout(() => {
      this.copied = false;
    }, 3000);
  };

  copyPoolID() {
    this.writePoolIDToClipboard();
  }
}
