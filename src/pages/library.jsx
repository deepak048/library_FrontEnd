import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { useApi } from '../hooks/useApiHelper';
import "../css/custom.css";
import noImage from '../assets/noImage.png';
import { useNavigate } from "react-router-dom";

export default function SortingDemo() {
    const [products, setProducts] = useState([]);
    const { apiRequest } = useApi();
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const toast = React.useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await apiRequest({
                url: "http://localhost:8080/api/library/books",
                method: "GET",
            });
            console.log('Books response:', response);

            if (Array.isArray(response)) {
                setProducts(response);
            } else {
                console.error('Unexpected response format for books:', response);
            }

            const response1 = await apiRequest({
                url: "http://localhost:8080/api/library/userBorrowedBooks",
                method: "POST",
            });
            console.log('Borrowed books response:', response1);

            if (Array.isArray(response1)) {
                setBorrowedBooks(response1);
            } else {
                console.error('Unexpected response format for borrowed books:', response1);
            }
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    const addToBorrowCart = async (book) => {
        if (borrowedBooks.some((borrowedBook) => borrowedBook.id === book.id)) {
            toast.current.show({ severity: 'warn', summary: 'Duplicate Book', detail: 'This book is already in your borrow cart.' });
        } else if (borrowedBooks.length >= 2) {
            toast.current.show({ severity: 'error', summary: 'Limit Reached', detail: 'You can only borrow up to 2 books at a time.' });
        } else {
            try {
                const borrowResponse = await apiRequest({
                    url: "http://localhost:8080/api/library/addBorrowBooks",
                    method: "POST",
                    payload: {
                        id: book.id,
                    },
                });

                if (borrowResponse) {
                    toast.current.show({ severity: 'success', summary: 'Book Borrowed', detail: 'Book has been successfully borrowed.' });
                    fetchBooks();
                } else {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to borrow the book.' });
                }
            } catch (error) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'An error occurred while borrowing the book.' });
            }
        }
    };

    const handleLogout = async () => {
        try {
            const response = await apiRequest({
                url: "http://localhost:8080/api/logout",
                method: "POST",
            });

            if (response) {
           
                document.cookie = "jwtToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;

                toast.current.show({ severity: 'success', summary: 'Logged Out', detail: 'You have been logged out successfully.' });
                navigate('/'); 
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to logout.' });
            }
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'An error occurred while logging out.' });
        }
    };

    const itemTemplate = (product) => {
        return (
            <div className="book-card flex align-items-center p-3 surface-card border-round mb-3 table-row">
                <div className="book-image-container">
                    <img className="book-image" src={noImage} alt={product.title} />
                </div>
                <div className="book-title text-center px-3">{product.title}</div>
                <div className="book-author text-center px-3">{product.author}</div>
                <div className="book-count text-center px-3">
                    <Tag value={`No of Books: ${product.noOfBooks}`} severity="info"></Tag>
                </div>
                <div className="action text-center px-3">
                    <Button
                        icon="pi pi-shopping-cart"
                        label="Borrow"
                        className="p-button-rounded p-button-outlined"
                        onClick={() => addToBorrowCart(product)}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="card p-4">
            <Toast ref={toast} />

        
            <div className="flex justify-content-between align-items-center mb-4" style={{ width: '100%' }}>
                <h2 className="text-2xl font-bold">Books Available in Library</h2>
                <div className="button-container">
                    <Button
                        icon="pi pi-cart"
                        label={`Borrow Cart (${borrowedBooks.length})`}
                        className="p-button-rounded p-button-sm p-button-primary mr-2"
                        style={{ width: '150px' }}
                        onClick={() => navigate('/borrowCart')} 
                    />
                    <Button
                        icon="pi pi-sign-out"
                        label="Logout"
                        className="p-button-rounded p-button-sm p-button-danger"
                        style={{ marginLeft: '1200px', width: '150px' }} 
                        onClick={handleLogout} 
                    />
                </div>
            </div>

          
            <div className="table-row-header flex align-items-center mb-2 p-3 border-bottom-1 surface-border">
                <div className="book-image-header text-center px-3">Image</div>
                <div className="book-title-header text-center px-3">Title</div>
                <div className="book-author-header text-center px-3">Author</div>
                <div className="book-count-header text-center px-3">Count</div>
                <div className="action-header text-center px-3">Action</div>
            </div>

          
            <DataView
                value={products || []}
                itemTemplate={itemTemplate}
                layout="list"
                paginator
                rows={5}
            />
        </div>
    );
}
