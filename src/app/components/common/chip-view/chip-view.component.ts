import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-chip-view',
  templateUrl: './chip-view.component.html',
  styleUrls: ['./chip-view.component.scss']
})
export class ChipViewComponent {
  // Inputs/outputs relating to core functionality
  @Input() assignments: number[] = [];
  @Input() denominations: number[] = [];
  @Input() viewOnly: boolean = false;
  @Output() chipSelect: EventEmitter<number> = new EventEmitter<number>();

  // Inputs/outputs relating to distribution view functionality
  @Input() chipDistributions: number[] = [];
  @Input() chipLockStatuses: boolean[] = [];
  @Input() distributionView: boolean = false;
  @Output() chipLockStatusesChange = new EventEmitter<boolean[]>();

  public selectedSlot: number = -1;

  /**
   * @returns {boolean} Whether the component currently has chip assignments to display
   */
  hasAssignments(): boolean {
    return this.assignments.length !== 0;
  }

  /**
   * Handles chip selection
   * 
   * @param {number} index The index of the selected chip 
   */
  onSelect(index: number) {
    this.selectedSlot = index;
    this.chipSelect.emit(index);
  }

  /**
   * Toggles whether a chip amount is locked in for the distribution view, emits the new lock statuses
   * 
   * @param {number} index The index of the selected lock 
   */
  toggleChipLocked(index: number) {
    this.chipLockStatuses[index] = !this.chipLockStatuses[index];
    this.chipLockStatusesChange.emit(this.chipLockStatuses);
  }

  /**
   * @param {number} index The index of the chip
   * @returns {boolean} Whether the given chip amount is locked
   */
  isChipLocked(index: number): boolean {
    return this.chipLockStatuses[index];
  }
}
