import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

function CurrentToken() {
    const [currentToken, setCurrentToken] = useState('T-101');

    useEffect(() => {
        const socket = io('http://localhost:3000');

        socket.on('tokenChange', (newToken) => {
            setCurrentToken(newToken);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3000/currentToken')
            .then(response => {
                setCurrentToken(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    return (
        <div className="current-token">
            <h1>Current Token:</h1>
            <h2 id="current-token-number">{currentToken}</h2>
        </div>
    );
}

export default CurrentToken;
