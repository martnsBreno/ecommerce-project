import { Component, destroyPlatform, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { FormServiceService } from 'src/app/services/form-service.service';
import { Myvalidators } from 'src/app/validators/myvalidators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAdressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
    private formService: FormServiceService) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
          [Validators.required, Validators.minLength(2), Myvalidators.notOnlyWhiteSpace])!,
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), Myvalidators.notOnlyWhiteSpace],),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAdress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), Myvalidators.notOnlyWhiteSpace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), Myvalidators.notOnlyWhiteSpace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), Myvalidators.notOnlyWhiteSpace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required, Validators.minLength(2), Myvalidators.notOnlyWhiteSpace]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), Myvalidators.notOnlyWhiteSpace]),
        cardNumber: new FormControl('', [Validators.required, Validators.minLength(2), Myvalidators.notOnlyWhiteSpace]),
        securityCode: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(3) ,Myvalidators.notOnlyWhiteSpace]),
        expirationMonth: new FormControl('', [Validators.required]),
        expirationYear: new FormControl('', [Validators.required])
      }),
    });

    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth" + startMonth);

    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    this.formService.getCreditCardYears().subscribe(
      data => {
        console.log("credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    )

    this.formService.getCountries().subscribe(
      data => {
        this.countries = data;
      });
  }

  onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }
  }

  handleMonthsAndYears() {

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(Number(creditCardFormGroup?.value.expirationYear));

    let startMonth: number;

    if (currentYear == selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("retrieved credit card months: " + JSON.stringify(data))
        this.creditCardMonths = data;
      }
    )
  }

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;

    this.formService.getStates(countryCode).subscribe(
      data => {
        this.shippingAdressStates = data;
      }
    )
  }

  //getters for customer

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  //getters for shipping adress

  get street() { return this.checkoutFormGroup.get('shippingAdress.street'); }
  get city() { return this.checkoutFormGroup.get('shippingAdress.city'); }
  get state() { return this.checkoutFormGroup.get('shippingAdress.state'); }
  get country() { return this.checkoutFormGroup.get('shippingAdress.country'); }
  get zipCode() { return this.checkoutFormGroup.get('shippingAdress.zipCode'); }

  //getters for credit card

  get cardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get nameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get cardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get securityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }
  get expirationYear() { return this.checkoutFormGroup.get('creditCard.expirationYear'); }
  get expirationMonth() { return this.checkoutFormGroup.get('creditCard.expirationMonth'); }
}
