import { NgModule } from "@angular/core";
import { ReactiveInputComponent } from "./inputs/reactive-input.component";
import { ReactiveFormsModule } from "@angular/forms";
import { UIModule } from "./UI.module";
export { IErrorMessages } from "./inputs/reactive-input.component";

@NgModule({
    imports: [ ReactiveFormsModule, UIModule ],
    declarations: [ ReactiveInputComponent ],
    exports: [ ReactiveInputComponent ]
})
export class InputsModule {}