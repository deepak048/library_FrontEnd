import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie

export function useApi() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to make API requests
    const apiRequest = async ({ url, method = 'GET', payload = null, headers = {} }) => {
        setLoading(true);
        setError(null);

        // Retrieve the JWT token from cookies
        const token = Cookies.get('jwtToken');

        // Add Authorization header if the token is available
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            let response;
            switch (method) {
                case 'GET':
                    response = await axios.get(url, { headers });
                    break;
                case 'POST':
                    response = await axios.post(url, payload, { headers });
                    break;
                case 'PUT':
                    response = await axios.put(url, payload, { headers });
                    break;
                case 'DELETE':
                    response = await axios.delete(url, { headers });
                    break;
                default:
                    throw new Error('Invalid HTTP method');
            }
            setData(response.data);
            return response.data;
        } catch (err) {
            setError(err);
            console.error("API request error:", err);
            throw err; 
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, apiRequest };
}
