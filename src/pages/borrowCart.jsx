import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { useApi } from '../hooks/useApiHelper';
import "../css/custom.css";
import noImage from '../assets/noImage.png';
import { useNavigate } from 'react-router-dom';

export default function BorrowCart() {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const { apiRequest } = useApi();
    const toast = React.useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBorrowedBooks();
    }, []);

    const fetchBorrowedBooks = async () => {
        try {
            const response = await apiRequest({
                url: "http://localhost:8080/api/library/userBorrowedBooks",
                method: "POST",
            });
            if (Array.isArray(response)) {
                setBorrowedBooks(response);
            } else {
                console.error('Unexpected response format for borrowed books:', response);
            }
        } catch (error) {
            console.error('Error fetching borrowed books:', error);
        }
    };

    const returnBook = async (book) => {
        try {
            const response = await apiRequest({
                url: "http://localhost:8080/api/library/returnBooks",
                method: "POST",
                payload: { id: book.id },
            });

            if (response) {
                toast.current.show({ severity: 'success', summary: 'Book Returned', detail: 'Book has been successfully returned.' });
                fetchBorrowedBooks(); // Refresh the list of borrowed books
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to return the book.' });
            }
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'An error occurred while returning the book.' });
        }
    };

    const handleBackToLibrary = () => {
        navigate('/library'); // Navigate back to the library page
    };

    return (
        <div className="card p-4">
            <Toast ref={toast} />
            <div className="flex justify-content-between align-items-center mb-4">
                <h2 className="text-2xl font-bold">Your Borrowed Books</h2>
                <Button
                    icon="pi pi-arrow-left"
                    label="Back to Library"
                    className="p-button-rounded p-button-sm p-button-secondary"
                    style={{ marginLeft: '1250px',marginBottom: '10px', width: '250px' }}
                    onClick={handleBackToLibrary}
                />
            </div>

            {borrowedBooks.length === 0 ? (
                <p>No books borrowed yet.</p>
            ) : (
                borrowedBooks.map((book) => (
                    <div key={book.id} className="book-card flex align-items-center p-3 surface-card border-round mb-3 table-row">
                        {/* Book Image */}
                        <div className="book-image-container">
                            <img className="book-image" src={noImage} alt={book.title} style={{ width: '50px', height: '75px' }} />
                        </div>
                        {/* Book Title */}
                        <div className="book-title text-center px-3">{book.title}</div>
                        {/* Book Author */}
                        <div className="book-author text-center px-3">{book.author}</div>
                        {/* Book Count */}
                        <div className="book-count text-center px-3">
                            <Tag value={`No of Books: ${book.noOfBooks}`} severity="info"></Tag>
                        </div>
                        {/* Return Action */}
                        <div className="action text-center px-3">
                            <Button
                                icon="pi pi-undo"
                                label="Return"
                                className="p-button-rounded p-button-outlined"
                                onClick={() => returnBook(book)}
                            />
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
