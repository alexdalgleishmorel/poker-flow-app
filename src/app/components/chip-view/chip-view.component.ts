import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chip-view',
  templateUrl: './chip-view.component.html',
  styleUrls: ['./chip-view.component.scss']
})
export class ChipViewComponent {
  @Input() denominations: number[] = [];
  @Input() assignments: number[] = [];
}
