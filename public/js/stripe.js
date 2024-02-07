/* eslint-disable */
var stripe = Stripe(
  'pk_test_51N6vJcKfMRv4mZVIh9PsJk92HzO8ulWMQceFa8eF7U1FGVYL5xITJaqKaN5C5le4f8SYe7ZRqCSufwa5Rh7mJVKv0056VCNBbz'
);

const id = document.querySelector('#book-tour').dataset.tourId;
const btn = document.querySelector('#book-tour');
const bookTour = async tourId => {
  try {
    const session = await axios(`/api/v2/bookings/checkout-session/${tourId}`);
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
  }
  // 1) get checkout session from API

  // 2)Create checkout from charge credit card
};

btn.addEventListener('click', function(e) {
  e.preventDefault();
  btn.textContent = 'process...';
  bookTour(id);
});
