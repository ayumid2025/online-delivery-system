import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function AdminDashboard() {
    const [orders, setOrders] = useState([]);
    const [drivers, setDrivers] = useState([]);

    useEffect(() => {
        // Fetch all orders
        axios.get('http://localhost:5000/api/orders/all')
            .then(res => setOrders(res.data))
            .catch(err => console.error(err));

        // Track driver locations
        socket.on('driverLocation', data => {
            setDrivers(prev => [...prev.filter(d => d.driver_id !== data.driver_id), data]);
        });

        return () => socket.off('driverLocation');
    }, []);

    const assignDriver = (orderId, driverId) => {
        axios.put(`http://localhost:5000/api/orders/assign/${orderId}`, { driver_id: driverId })
            .then(res => {
                setOrders(prev => prev.map(o => o.id === orderId ? res.data : o));
            }).catch(err => console.error(err));
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <h2>Orders</h2>
            <ul>
                {orders.map(o => (
                    <li key={o.id}>
                        Order {o.id}: {o.status}
                        <button onClick={() => assignDriver(o.id, 2)}>Assign Driver 2</button>
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
