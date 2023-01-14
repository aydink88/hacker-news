import { timeDifference } from '../utils/time-ago';
import { Link } from 'react-router-dom';
import type { TArticle, TArticleMeta } from '../types';

const ArticleListItem = ({ article }: { article: TArticleMeta | TArticle }) => {
  const timeAgo = timeDifference(Date.now(), new Date(article.createdAt).getTime());
  return (
    <article className="story">
      <div className="story-container">
        <div className="story-data">
          <div className="story-title">
            <Link to={`/article/${article._id}`}>
              <span>{article.title}</span>
            </Link>
          </div>
          <div className="story-meta">
            <span>{article.like_count} points</span>
            <span className="story-separator">|</span>
            <span>
              <span>{article.author.username}</span>
            </span>
            <span className="story-separator">|</span>
            <span>{timeAgo}</span>
            <span className="story-separator">|</span>
            <span>{article.comment_count} comments</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticleListItem;
