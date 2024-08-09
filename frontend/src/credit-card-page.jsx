import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import CreditCardForm from './credit-card-form';
import LoadingSpinner from './spinner';
import './css/credit-card-page.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; 
const backend_url = 'http://localhost:4000';


const creditCardData = [
  {
    id: 1,
    bank: "Bank of America",
    name: "Visa Platinum",
    enabled: true,
    createdAt: "2023-08-01"
  },
  {
    id: 2,
    bank: "Chase Bank",
    name: "Chase Sapphire",
    enabled: false,
    createdAt: "2023-08-05"
  },
  {
    id: 3,
    bank: "Citibank",
    name: "Citi Double Cash",
    enabled: true,
    createdAt: "2023-08-10"
  },
  {
    id: 4,
    bank: "Wells Fargo",
    name: "Wells Fargo Rewards",
    enabled: true,
    createdAt: "2023-08-15"
  },
  {
    id: 5,
    bank: "American Express",
    name: "Amex Gold",
    enabled: true,
    createdAt: "2023-08-20"
  },
  {
    id: 6,
    bank: "Discover",
    name: "Discover It",
    enabled: false,
    createdAt: "2023-08-25"
  },
  {
    id: 7,
    bank: "HSBC",
    name: "HSBC Premier",
    enabled: true,
    createdAt: "2023-08-30"
  },
  {
    id: 8,
    bank: "Capital One",
    name: "Capital One Venture",
    enabled: true,
    createdAt: "2023-09-01"
  },
  {
    id: 9,
    bank: "Barclays",
    name: "Barclaycard Arrival Plus",
    enabled: false,
    createdAt: "2023-09-05"
  },
  {
    id: 10,
    bank: "TD Bank",
    name: "TD Cash",
    enabled: true,
    createdAt: "2023-09-10"
  },
  {
    id: 11,
    bank: "PNC Bank",
    name: "PNC Cash Rewards",
    enabled: true,
    createdAt: "2023-09-15"
  },
  {
    id: 12,
    bank: "U.S. Bank",
    name: "U.S. Bank Visa Platinum",
    enabled: true,
    createdAt: "2023-09-20"
  }
];


function CreditCardsPage() {
  const [creditCards, setCreditCards] = useState([]);
  const [banks, setBanks] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const [showOptions, setShowOptions] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 5;

  const optionsRef = useRef(null);

  useEffect(() => {
    const fetchCreditCards = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get(backend_url + '/api/credit-cards');
        const sortedData = response.data.sort((a, b) => a.id - b.id);
        setCreditCards(sortedData);
        console.log(sortedData);
      } catch (error) {
        console.error('Error fetching credit card data', error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchCreditCards();
  }, [showModal, showModalEdit, showModalDelete]);

  useEffect(() => {
    const bankNames = [...new Set(creditCardData.map((ele) => ele.bank))];
    setBanks(bankNames);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the optionsRef (options menu) and not on the edit or delete buttons
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target) &&
        !event.target.classList.contains('edit-button') &&
        !event.target.classList.contains('delete-button')
      ) {
        setShowOptions(null);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [optionsRef]);
  

  const handleAddCard = () => {
    setSelectedCard(null);
    setShowModal(true);
    setTimeout(() => setModalVisible(true), 10);
  };

  const handleEditCard = (card) => {
    setSelectedCard(card);
    setShowModalEdit(true);
    setTimeout(() => setModalVisible(true), 10);
  };

  const handleDeleteCard = (card) => {
    setSelectedCard(card);
    setShowModalDelete(true);
    setTimeout(() => setModalVisible(true), 10);
  };


  const handleCloseModal = () => {
    setModalVisible(false);
    setLoading(true); // Show loading on close
    setTimeout(() => {
      setShowModal(false);
      setShowModalEdit(false);
      setShowModalDelete(false);
      setLoading(false); // Hide loading after close
    }, 300);
  };


  const handleToggleOptions = (id) => {
    if (showOptions === id) {
      setShowOptions(null);
    } else {
      setShowOptions(id);
    }
  };

  const filteredCreditCards = creditCards.filter(card =>
    card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.bank.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredCreditCards.slice(indexOfFirstCard, indexOfLastCard);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredCreditCards.length / cardsPerPage);

  return (
    <div className="container">
      {loading && <LoadingSpinner />}
      <div className="header">
      <h1 className="title">Credit Cards</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search"
          className="search-bar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <i className="search-icon fas fa-search"></i> {/* FontAwesome search icon */}
      </div>
      <button className="add-button" onClick={handleAddCard}>
        Add Card
      </button>
    </div>

      {showModal && (
         <div className={`modal ${modalVisible ? 'modal-show' : 'modal-hide'}`}>
          <div className="modal-content">
            <CreditCardForm
              card={selectedCard}
              actionType={'add'}
              onSave={() => {}}
              onClose={handleCloseModal}
              banks={banks}
            />
          </div>
        </div>
      )}

      {showModalEdit && (
          <div className={`modal ${modalVisible ? 'modal-show' : 'modal-hide'}`}>
          <div className="modal-content">
            <CreditCardForm
              card={selectedCard}
              actionType={'update'}
              onSave={() => {}}
              onClose={handleCloseModal}
              banks={banks}
            />
          </div>
        </div>
      )}
      {showModalDelete && (
         <div className={`modal ${modalVisible ? 'modal-show' : 'modal-hide'}`}>
          <div className="modal-content">
            <CreditCardForm
              card={selectedCard}
              actionType={'delete'}
              onSave={() => {}}
              onClose={handleCloseModal}
              banks={banks}
            />
          </div>
        </div>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Bank Name</th>
            <th>Credit Card Name</th>
            <th>Enabled</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentCards.map(card => (
            <tr key={card.id}>
              <td>{card.id}</td>
              <td>{card.bank}</td>
              <td>{card.name}</td>
              <td><div className='checkbox-container'><input type='checkbox' checked={card.enabled}/></div></td>
              <td>{new Date(card.created_at).toLocaleString()}</td>
              <td>
                <div className="actions-container" ref={optionsRef}>
                  <button onClick={() => handleToggleOptions(card.id)} className="options-button">
                    &#8942;
                  </button>
                  {showOptions === card.id && (
                    <div className="options-menu">
                      <button onClick={() => handleEditCard(card)} className="edit-button">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteCard(card)} className="delete-button">
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CreditCardsPage;
