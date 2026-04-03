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
  const [comment, setComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    // If we have article in state BUT not author details or comment user fields, we fetch
    const isAuthorPopulated = article?.author && typeof article.author === 'object';
    const isCommentsPopulated = !article?.comments?.length || typeof article.comments[0].user === 'object';
    if (article && article.content && isAuthorPopulated && isCommentsPopulated) return;

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

  const refreshArticle = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/user-api/article/${id}`, { withCredentials: true });
      setArticle(res.data.payload);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load article");
    }
  };

  const addComment = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setCommentLoading(true);
    try {
      const currentUserId = user?._id || user?.userId || user?.id;
      
      await axios.put(
        "http://localhost:4000/user-api/articles",
        { userId: currentUserId, articleId: id, comment: comment.trim() },
        { withCredentials: true }
      );

      toast.success("Comment added successfully");
      setComment("");
      await refreshArticle();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to add comment");
    } finally {
      setCommentLoading(false);
    }
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

  {["USER", "AUTHOR", "ADMIN"].includes(user?.role) && (
        <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-lg font-bold text-slate-900">Comments</h3>

          {Array.isArray(article.comments) && article.comments.length > 0 ? (
            <div className="mt-4 space-y-3">
              {article.comments.map((item, index) => (
                <div key={item._id || index} className="rounded-lg border border-slate-200 bg-white p-3">
                  <p className="text-sm text-slate-800">{item.comment}</p>
                  <div className="mt-1 text-xs text-slate-500">
                    <p>Username: {item.user?.firstName || "User"} {item.user?.lastName || ""}</p>
                    <p>Email: {item.user?.email || "Not available"}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500">No comments yet.</p>
          )}

          {user?.role === "USER" && (
            <form onSubmit={addComment} className="mt-4 space-y-3">
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add your comment"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-cyan-500"
              />
              <button
                type="submit"
                disabled={commentLoading}
                className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {commentLoading ? "Posting..." : "Add Comment"}
              </button>
            </form>
          )}
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
