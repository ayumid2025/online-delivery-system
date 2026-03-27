import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe('pk_test_your_publishable_key');

const CheckoutForm = ({ orderId, amount }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        axios.post('http://localhost:5000/api/payments/create-payment-intent', { order_id: orderId, amount })
            .then(res => setClientSecret(res.data.clientSecret))
            .catch(err => console.error(err));
    }, [orderId, amount]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        const card = elements.getElement(CardElement);
        const result = await stripe.confirmCardPayment(clientSecret, { payment_method: { card } });

        if (result.error) {
            alert(result.error.message);
        } else {
            if (result.paymentIntent.status === 'succeeded') {
                axios.post('http://localhost:5000/api/payments/confirm', { paymentId: result.paymentIntent.id });
                alert('Payment Successful!');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit" disabled={!stripe}>Pay ${amount}</button>
        </form>
    );
};

export default function CheckoutWrapper(props) {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm {...props} />
        </Elements>
    );
}
