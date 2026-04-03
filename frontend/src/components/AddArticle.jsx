import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { formCard, formTitle, formGroup, labelClass, inputClass, submitBtn, errorClass } from '../styles/common'

function AddArticle() {
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            title: '',
            category: '',
            content: ''
        }
    })

    const onSubmit = async (data) => {
        try {
            await axios.post('http://localhost:4000/author-api/articles', data, { withCredentials: true })
            toast.success("Article published successfully!")
            navigate('/authordashboard')
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to publish article")
        }
    }

    return (
        <div className="py-10">
            <div className={formCard + " max-w-2xl"}>
                <h2 className={formTitle}>Create New Article</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={formGroup}>
                        <label className={labelClass}>Title</label>
                        <input 
                            className={inputClass}
                            {...register('title', { required: 'Title is required' })}
                            placeholder="Enter article title..."
                        />
                        {errors.title && <p className={errorClass + " mt-1"}>{errors.title.message}</p>}
                    </div>

                    <div className={formGroup}>
                        <label className={labelClass}>Category</label>
                        <select 
                            className={inputClass}
                            {...register('category', { required: 'Category is required' })}
                        >
                            <option value="">Select a category</option>
                            <option value="Technology">Technology</option>
                            <option value="Lifestyle">Lifestyle</option>
                            <option value="Education">Education</option>
                            <option value="Business">Business</option>
                            <option value="Other">Other</option>
                        </select>
                        {errors.category && <p className={errorClass + " mt-1"}>{errors.category.message}</p>}
                    </div>

                    <div className={formGroup}>
                        <label className={labelClass}>Content</label>
                        <textarea 
                            className={inputClass + " h-64 resize-none"}
                            {...register('content', { required: 'Content is required' })}
                            placeholder="Write your article content here..."
                        />
                        {errors.content && <p className={errorClass + " mt-1"}>{errors.content.message}</p>}
                    </div>

                    <button disabled={isSubmitting} className={submitBtn}>
                        {isSubmitting ? 'Publishing...' : 'Publish Article'}
                    </button>
                    <button type="button" onClick={() => navigate(-1)} className="w-full mt-3 text-sm text-[#6e6e73] hover:text-[#1d1d1f]">
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AddArticle
