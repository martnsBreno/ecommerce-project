import { Component, destroyPlatform, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { PaymentInfo } from 'src/app/common/payment-info';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { FormServiceService } from 'src/app/services/form-service.service';
import { Myvalidators } from 'src/app/validators/myvalidators';
import { environment } from 'src/environments/environment';

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

  stripe = Stripe(environment.stripePublishableKey);

  cardElement: any;
  displayError: any = "";

  isDisabled: boolean = false;

  paymentInfo: PaymentInfo = new PaymentInfo();

  constructor(private formBuilder: FormBuilder,
    private formService: FormServiceService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router) { }

  ngOnInit(): void {

    this.setUpStripePaymentForm();

    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
          [Validators.required, Validators.minLength(2), Myvalidators.notOnlyWhiteSpace])!,
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), Myvalidators.notOnlyWhiteSpace],),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), Myvalidators.notOnlyWhiteSpace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), Myvalidators.notOnlyWhiteSpace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), Myvalidators.notOnlyWhiteSpace])
      }),
      creditCard: this.formBuilder.group({
      }),
    });

    this.formService.getCountries().subscribe(
      data => {
        this.countries = data;
      });
  }

  setUpStripePaymentForm() {
    var elements = this.stripe.elements();

    this.cardElement = elements.create('card', { hidePostalCode: true });

    this.cardElement.mount('#card-element');

    this.cardElement.on('change', (event: any) => {

      this.displayError = document.getElementById('card-errors');
      if (event.complete) {
        this.displayError.texContent = "";
      } else if (event.error) {
        this.displayError.texContent = event.error.message;
      }
    });
  }

  reviewCartDetails() {

    // subscribe to cartService.totalQuantity
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

    //subscribe to cartSerice.totalPrice
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );

  }

    //getters for customer

    get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
    get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
    get email() { return this.checkoutFormGroup.get('customer.email'); }
  
    //getters for shipping adress
  
    get street() { return this.checkoutFormGroup.get('shippingAddress.street'); }
    get city() { return this.checkoutFormGroup.get('shippingAddress.city'); }
    get state() { return this.checkoutFormGroup.get('shippingAddress.state'); }
    get country() { return this.checkoutFormGroup.get('shippingAddress.country'); }
    get zipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  
    //getters for credit card
  
    get cardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
    get nameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
    get cardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
    get securityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }
    get expirationYear() { return this.checkoutFormGroup.get('creditCard.expirationYear'); }
    get expirationMonth() { return this.checkoutFormGroup.get('creditCard.expirationMonth'); }

  onSubmit() {
    console.log("Handling the submit button");

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    //set up order
    let order = new Order();
    order.totalPrice = this.totalPrice
    order.totalQuantity = this.totalQuantity

    //get cart items
    const cartItems = this.cartService.cartItems;

    //create orderItems from cartItems
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    //set up purchase
    let purchase = new Purchase();

    //populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    //populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;


    //populate purchase - shipping address
    purchase.billingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    purchase.billingAddress.state = shippingState.name;
    purchase.billingAddress.country = shippingCountry.name;

    //populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = "BRL";
    this.paymentInfo.receiptEmail = purchase.customer.email;

    console.log(`paymentInfo Amount: ${this.paymentInfo.amount}`);

    if (!this.checkoutFormGroup.invalid && this.displayError.textContent === "") {
      this.isDisabled = true;

      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse) => {
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
            {
              payment_method: {
                card: this.cardElement,
                billing_details: {
                  email: purchase.customer.email,
                  name: `${purchase.customer.firstName} +  ${purchase.customer.lastName}`,
                  address: {
                    line1: purchase.billingAddress.street,
                    city: purchase.billingAddress.city,
                    state: purchase.billingAddress.state,
                    postal_code: purchase.billingAddress.zipCode
                  }
                } 
              }
            }, { handleActions: false })
            .then((result: any) => {
              if (result.error) {
                alert(`There was an erro: ${result.error.message}`);
                this.isDisabled = false;
              } else {
                this.checkoutService.placeOrder(purchase).subscribe({
                  next: (response: any) => {
                    alert(`Seu número de rastreio: ${response.orderTrackingNumber}`);

                    this.resetCard();
                    this.isDisabled = false;
                  },
                  error: (err: any) => {
                    alert(`There was an error: ${err.message}`);
                  }
                });
              }
            })
        }
      );
    }
  }

  resetCard() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    this.checkoutFormGroup.reset();

    this.router.navigateByUrl("/products");

    this.cartService.persistCartItems();
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


}
