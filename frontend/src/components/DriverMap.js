import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function DriverMap() {
    const [drivers, setDrivers] = useState([]);

    useEffect(() => {
        socket.on('driverLocation', (data) => {
            setDrivers((prev) => [...prev.filter(d => d.driver_id !== data.driver_id), data]);
        });
        return () => socket.off('driverLocation');
    }, []);

    return (
        <div>
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
