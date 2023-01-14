import { useEffect } from 'react';
import ArticleListItem from '../components/ArticleListItem';
import Pagination from '../components/Pagination';
import { useAppContext } from '../context/AppContext';

const ArticleList = () => {
  const { getArticles, articles } = useAppContext();

  useEffect(() => {
    getArticles();
  }, [getArticles]);
  return (
    <section className="article-list">
      <div className="article-container">
        {articles.map((article) => (
          <ArticleListItem key={article._id} article={article} />
        ))}
      </div>
      <Pagination />
    </section>
  );
};

export default ArticleList;
