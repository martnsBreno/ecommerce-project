import { FormControl, ValidationErrors } from "@angular/forms";

export class Myvalidators {

    
    static notOnlyWhiteSpace(control: FormControl) : ValidationErrors | null {
        if ((control.value != null) && (control.value.trim().length === 0)) {
            //invalid, return error object
            return { 'notOnlyWhiteSpace': true};
        } else {
            return null;
        }

}
}