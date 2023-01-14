import prevButton from './previous.svg';
import nextButton from './next.svg';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const Pagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { getArticles } = useAppContext();

  const selectPageHandler = (n: number) => {
    getArticles(n).then(() => setCurrentPage(n));
  };

  return (
    <ul className="pagination">
      <li className="pagination-item pagination-previous">
        <button disabled={currentPage === 1}>
          <img src={prevButton} alt="prevbutton" />
        </button>
      </li>
      {[1, 2, 3, 4, 5].map((n) => {
        return (
          <li
            key={n}
            className={`pagination-item${currentPage === n ? ' pagination-item-current' : ''}`}
          >
            <button onClick={() => selectPageHandler(n)}>{n}</button>
          </li>
        );
      })}

      <li className="pagination-item pagination-next">
        <button>
          <img src={nextButton} alt="prevbutton" />
        </button>
      </li>
    </ul>
  );
};

export default Pagination;
