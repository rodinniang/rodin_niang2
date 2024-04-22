import { useEffect, useState } from 'react';
import Modal from 'react-modal';

type Call = {
    id: string;
    from: string;
    to: string;
    date: string;
    duration: number;
    subject: string;
    summary: string;
};

const CallsPage = () => {
    const [calls, setCalls] = useState<Call[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedSummary, setSelectedSummary] = useState('');

    const formatPhoneNumber = (phoneNumber: string) => {
        const match = phoneNumber.match(/(\+33|0)(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/);
        return match ? `0${match[2]} ${match[3]} ${match[4]} ${match[5]} ${match[6]}` : phoneNumber;
    };

    useEffect(() => {
        const fetchCalls = async () => {
            try {
                const response = await fetch('/api/calls?to=+33123456789');
                if (!response.ok) {
                    throw new Error('Failed to fetch calls');
                }
                const data = await response.json();
                setCalls(data);
            } catch (error) {
                setError('Failed to load calls');
            }
        };

        fetchCalls();
    }, []);

    const openModal = (summary: string) => {
        setSelectedSummary(summary);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <div>
            <h1>Call List</h1>
            {error && <p>{error}</p>}
            <ul>
                {calls.map(call => (
                    <li key={call.id} onClick={() => openModal(call.summary)}>
                        <div>Date: {new Date(call.date).toLocaleString()}</div>
                        <div>From: {formatPhoneNumber(call.from)}</div>
                        <div>Duration: {call.duration} seconds</div>
                        <div>Subject: {call.subject}</div>
                    </li>
                ))}
            </ul>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Call Summary"
            >
                <h2>Summary</h2>
                <p>{selectedSummary}</p>
                <button onClick={closeModal}>Close</button>
            </Modal>
        </div>
    );
};

export default CallsPage;
