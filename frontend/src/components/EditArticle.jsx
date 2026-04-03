import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

import {
    formCard,
    formTitle,
    formGroup,
    labelClass,
    inputClass,
    submitBtn,
    errorClass,
    articlePageWrapper,
} from "../styles/common";

function EditArticle() {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const [article, setArticle] = useState(location.state);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    // fetch if not in state (e.g. refresh)
    useEffect(() => {
        if (!article) {
            const fetchArticle = async () => {
                try {
                    const res = await axios.get(`http://localhost:4000/common-api/articles/${id}`, { withCredentials: true })
                    setArticle(res.data.payload)
                } catch (err) {
                    toast.error("Failed to load article")
                    navigate('/authordashboard')
                }
            }
            fetchArticle()
        }
    }, [id, article, navigate]);

    // prefill form
    useEffect(() => {
        if (!article) return;

        setValue("title", article.title);
        setValue("category", article.category);
        setValue("content", article.content);
    }, [article, setValue]);

    const updateArticle = async (data) => {
        try {
            data.articleId = article._id;
            let res = await axios.put("http://localhost:4000/author-api/articles", data, { withCredentials: true });
            toast.success("Article updated successfully!")
            navigate(`/article/${article._id}`, {
                state: res.data.payload,
            });
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update article")
        }
    };

    return (
        <div className={articlePageWrapper}>
            <div className={`${formCard} max-w-2xl`}>
                <h2 className={formTitle}>Edit Article</h2>

                <form onSubmit={handleSubmit(updateArticle)}>
                    {/* Title */}
                    <div className={formGroup}>
                        <label className={labelClass}>Title</label>

                        <input className={inputClass} {...register("title", { required: "Title required" })} />

                        {errors.title && <p className={errorClass + " mt-1"}>{errors.title.message}</p>}
                    </div>

                    {/* Category */}
                    <div className={formGroup}>
                        <label className={labelClass}>Category</label>

                        <select className={inputClass} {...register("category", { required: "Category required" })}>
                            <option value="">Select category</option>
                            <option value="Technology">Technology</option>
                            <option value="Lifestyle">Lifestyle</option>
                            <option value="Education">Education</option>
                            <option value="Business">Business</option>
                            <option value="Other">Other</option>
                        </select>

                        {errors.category && <p className={errorClass + " mt-1"}>{errors.category.message}</p>}
                    </div>

                    {/* Content */}
                    <div className={formGroup}>
                        <label className={labelClass}>Content</label>

                        <textarea rows="14" className={inputClass + " resize-none"} {...register("content", { required: "Content required" })} />

                        {errors.content && <p className={errorClass + " mt-1"}>{errors.content.message}</p>}
                    </div>

                    <button className={submitBtn}>Update Article</button>
                    <button type="button" onClick={() => navigate(-1)} className="w-full mt-3 text-sm text-[#6e6e73] hover:text-[#1d1d1f]">
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditArticle;