import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

/**
 * ChipSelect component and its sub-components
 */
import { ChipSelectComponent } from './chip-select/chip-select.component';
import { ColorPickerComponent } from './chip-select/color-picker/color-picker.component';

/**
 * ChipView component and its sub-components
 */
import { ChipViewComponent } from './chip-view/chip-view.component';


/**
 * EmptySearchMessage component and its sub-components
 */
import { EmptySearchMessageComponent } from './empty-search-message/empty-search-message.component';

/**
 * LoadingSpinner component and its sub-components
 */
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

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

@NgModule({
  declarations: [
    ChipSelectComponent,
    ChipViewComponent,
    ColorPickerComponent,
    EmptySearchMessageComponent,
    LoadingSpinnerComponent,
    ThousandSuffixesPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule
  ],
  exports: [
    ChipSelectComponent,
    ChipViewComponent,
    ColorPickerComponent,
    EmptySearchMessageComponent,
    LoadingSpinnerComponent,
    ThousandSuffixesPipe
  ]
})
export class AppCommonModule {}
