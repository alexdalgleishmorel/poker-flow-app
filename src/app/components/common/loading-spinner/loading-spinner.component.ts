import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { API_TIMEOUT_CONSTRAINT } from '@constants';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
})
export class LoadingSpinnerComponent implements OnInit {
  @Input() isNetworkRequest: boolean = true;
  @Output() requestRetry: EventEmitter<boolean> = new EventEmitter<boolean>();

  public timeoutTriggered: boolean = false;

  constructor() {}

  ngOnInit(): void {
    if (this.isNetworkRequest) {
      this.triggerTimeoutCheck();
    }
  }

  triggerTimeoutCheck() {
    this.timeoutTriggered = false;
    setTimeout(() => {
      this.timeoutTriggered = true;
    }, API_TIMEOUT_CONSTRAINT);
  }

  onRetry() {
    this.triggerTimeoutCheck();
    this.requestRetry.emit(true);
  }
}
