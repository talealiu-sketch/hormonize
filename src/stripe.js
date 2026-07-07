import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = 'pk_test_51TqYCBIVLKqOkL4KGq1Nt88ojSBl7EK8DmYi1se08aqAmqdIzS8NTpDEawj6grOYWtAam5sEeZuKJhIDbDIo2mz400kLz9qnKW';

export const stripe = loadStripe(stripePublishableKey);

export const PRICES = {
  basic_monthly: 'price_1TqYJKIVLKqOkL4KyJ9wPfec
',
  pro_monthly: 'price_1TqYKMIVLKqOkL4KnwzA9Vbz',
};