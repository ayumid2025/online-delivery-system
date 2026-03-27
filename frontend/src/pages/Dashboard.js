import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function Dashboard() {
    const [orders, setOrders] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        // Fetch customer orders
        axios.get(`http://localhost:5000/api/orders/customer/${user.id}`)
            .then(res => setOrders(res.data))
            .catch(err => console.error(err));

        // Listen for live driver location
        socket.on('driverLocation', data => {
            setDrivers(prev => [...prev.filter(d => d.driver_id !== data.driver_id), data]);
        });

        return () => socket.off('driverLocation');
    }, [user.id]);

    return (
        <div>
            <h1>Welcome {user.name}</h1>
            <h2>Your Orders</h2>
            <ul>
                {orders.map(o => (
                    <li key={o.id}>
                        Order {o.id}: {o.status} - Pickup: {o.pickup_address} - Delivery: {o.delivery_address}
                    </li>
                ))}
            </ul>

            <h2>Live Driver Locations</h2>
            <ul>
                {drivers.map(d => (
                    <li key={d.driver_id}>
                        Driver {d.driver_id}: Lat {d.lat}, Lng {d.lng}
                    </li>
                ))}
            </ul>
        </div>
    );
}
