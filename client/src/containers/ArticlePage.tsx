import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ArticleListItem from "../components/ArticleListItem";
import { TArticle } from "../types";

const ArticlePage = () => {
  const { id } = useParams();
  const [message, setMessage] = useState("Loading...");
  const [article, setArticle] = useState<TArticle>();

  useEffect(() => {
    const getArticle = async () => {
      const articleCache = sessionStorage.getItem(`article_${id}`);
      if (articleCache) {
        return setArticle(JSON.parse(articleCache));
      }
      try {
        const res = await axios.get(`/api/v1/articles/${id}`);
        sessionStorage.setItem(`article_${id}`, JSON.stringify(res.data.article));
        return setArticle(res.data.article);
      } catch (err: any) {
        setMessage(err.message || "something went wrong");
      }
    };
    getArticle();
  }, [id]);

  if (!article) {
    return <h1>{message}</h1>;
  }

  return (
    <div>
      <ArticleListItem article={article} />
      <div className="story-content">{article.text}</div>
    </div>
  );
};

export default ArticlePage;
