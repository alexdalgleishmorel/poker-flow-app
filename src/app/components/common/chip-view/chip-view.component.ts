import { Component, EventEmitter, Input, Output, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thousandSuff'
})
export class ThousandSuffixesPipe implements PipeTransform {

  transform(input: any, args?: any): any {
    var exp, suffixes = ['K', 'M', 'B', 'T', 'P', 'E'];

    if (Number.isNaN(input) || input < 0) {
      return null;
    }

    if (input < 1) {
      return '¢' + (input*100).toFixed(args);
    }

    if (input < 1000) {
      return '$' + input;
    }

    exp = Math.floor(Math.log(input) / Math.log(1000));

    return '$' + (input / Math.pow(1000, exp)).toFixed(args) + suffixes[exp - 1];
  }

}

@Component({
  selector: 'app-chip-view',
  templateUrl: './chip-view.component.html',
  styleUrls: ['./chip-view.component.scss']
})
export class ChipViewComponent {
  @Input() denominations: number[] = [];
  @Input() assignments: number[] = [];
  @Input() viewOnly: boolean = false;
  @Output() chipSelect: EventEmitter<number> = new EventEmitter<number>();

  hasAssignments(): boolean {
    return this.assignments.length !== 0;
  }

  onSelect(index: number) {
    this.chipSelect.emit(index);
  }
}
