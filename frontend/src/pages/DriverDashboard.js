import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function DriverDashboard() {
    const [orders, setOrders] = useState([]);
    const [location, setLocation] = useState({ lat: 0, lng: 0 });
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        axios.get(`http://localhost:5000/api/orders/driver/${user.id}`)
            .then(res => setOrders(res.data))
            .catch(err => console.error(err));

        // Track location every 5 sec
        const geoWatch = navigator.geolocation.watchPosition(position => {
            const loc = { lat: position.coords.latitude, lng: position.coords.longitude, driver_id: user.id };
            setLocation(loc);
            socket.emit('driverLocationUpdate', loc);
        });

        return () => navigator.geolocation.clearWatch(geoWatch);
    }, [user.id]);

    const updateStatus = (orderId, status) => {
        axios.put(`http://localhost:5000/api/orders/status/${orderId}`, { status })
            .then(res => {
                setOrders(prev => prev.map(o => o.id === orderId ? res.data : o));
            }).catch(err => console.error(err));
    };

    return (
        <div>
            <h1>Driver Dashboard</h1>
            <ul>
                {orders.map(o => (
                    <li key={o.id}>
                        Order {o.id}: {o.status}
                        <button onClick={() => updateStatus(o.id, 'picked_up')}>Picked Up</button>
                        <button onClick={() => updateStatus(o.id, 'delivered')}>Delivered</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
