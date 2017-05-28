import { AbstractControl } from "@angular/forms";

/**
 * Validates two fields if they have the same value
 * @param sameTo Control which must have same value
 */
export function sameFields(sameTo: AbstractControl) {
    return (control: AbstractControl) => {
        if (control.value !== sameTo.value) {
            return { sameFields: { control: control.value, sameTo: sameTo.value } };
        } else {
            return null;
        }
    };
}