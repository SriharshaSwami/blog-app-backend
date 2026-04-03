import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../store/authStore";
import { toast } from "react-hot-toast";
import {
  articlePageWrapper,
  articleHeader,
  articleCategory,
  articleMainTitle,
  articleAuthorRow,
  authorInfo,
  articleContent,
  articleFooter,
  articleActions,
  editBtn,
  deleteBtn,
  loadingClass,
  errorClass,
} from "../styles/common.js";

function ArticleByID() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const user = useAuth((state) => state.currentUser);

  const [article, setArticle] = useState(location.state || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If we have article in state BUT not author details, we fetch
    const isAuthorPopulated = article?.author && typeof article.author === 'object';
    if (article && article.content && isAuthorPopulated) return;

    const getArticle = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:4000/user-api/article/${id}`, { withCredentials: true });
        setArticle(res.data.payload);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    getArticle();
  }, [id, article]);

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const toggleArticleStatus = async () => {
    const newStatus = !article.isArticleActive;
    const confirmMsg = newStatus ? "Restore this article?" : "Delete this article?";
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await axios.patch(
        `http://localhost:4000/author-api/articles/${id}/status`,
        { isArticleActive: newStatus },
        { withCredentials: true },
      );
      setArticle(res.data.article || res.data.payload);
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };
  
  const editArticle = (articleObj) => {
    navigate(`/edit-article/${id}`, { state: articleObj });
  };

  if (loading) return <p className={loadingClass}>Loading article...</p>;
  if (error) return <p className={errorClass}>{error}</p>;
  if (!article) return null;

  return (
    <div className={articlePageWrapper}>
      <button onClick={() => navigate(-1)} className="mb-8 text-[#0066cc] hover:text-[#004499] text-sm font-medium flex items-center gap-1.5 transition-all hover:-translate-x-1">
        ← Back
      </button>

      <div className={articleHeader}>
        <span className={articleCategory}>{article.category}</span>
        <h1 className={`${articleMainTitle}`}>{article.title}</h1>

        <div className={articleAuthorRow}>
          <div className={authorInfo}>✍️ {article.author?.firstName || "Author"} {article.author?.lastName || ""}</div>
          <div>{formatDate(article.createdAt)}</div>
        </div>
      </div>

      <div className={articleContent}>{article.content}</div>

      {user?.role === "AUTHOR" && String(article.author?._id || article.author) === String(user._id) && (
        <div className={articleActions}>
          <button className={editBtn} onClick={() => editArticle(article)}>
            Edit
          </button>
          <button className={deleteBtn} onClick={toggleArticleStatus}>
            {article.isArticleActive ? "Delete" : "Restore"}
          </button>
        </div>
      )}

      <div className={articleFooter}>
        <p>Published: {formatDate(article.createdAt)}</p>
        {article.updatedAt !== article.createdAt && (
            <p className="mt-1">Last updated: {formatDate(article.updatedAt)}</p>
        )}
      </div>
    </div>
  );
}

export default ArticleByID;
