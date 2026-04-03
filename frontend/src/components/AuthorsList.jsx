import React from 'react'
import { articleStatusActive, articleStatusDeleted } from '../styles/common'

function AuthorsList({ authors, onToggleBlock }) {
  if (!authors || authors.length === 0) {
    return <p className="text-gray-500 text-center py-8">No authors found.</p>
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
      <table className="w-full text-left text-sm text-slate-700">
        <thead className="bg-[#f5f5f7] text-[#1d1d1f] border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 font-semibold">Name</th>
            <th className="px-6 py-4 font-semibold">Email</th>
            <th className="px-6 py-4 font-semibold">Status</th>
            <th className="px-6 py-4 font-semibold text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {authors.map(author => (
            <tr key={author._id} className="hover:bg-[#f5f5f7] transition-colors">
              <td className="px-6 py-4 font-medium text-[#1d1d1f] flex items-center gap-3">
                {author.profileImageUrl ? (
                    <img src={author.profileImageUrl} alt="author" className="w-8 h-8 rounded-full border border-slate-200 object-cover" />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-[#0066cc] flex items-center justify-center text-white text-xs font-bold">
                        {author.firstName?.charAt(0)}
                    </div>
                )}
                {author.firstName} {author.lastName || ''}
              </td>
              <td className="px-6 py-4">{author.email}</td>
              <td className="px-6 py-4">
                <span className={author.isActive ? articleStatusActive : articleStatusDeleted}>
                  {author.isActive ? 'ACTIVE' : 'BLOCKED'}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button 
                  onClick={() => onToggleBlock(author)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold text-white transition ${author.isActive ? 'bg-[#ff3b30] hover:bg-[#d70015]' : 'bg-[#34c759] hover:bg-[#248a3d]'}`}
                >
                  {author.isActive ? 'Block Author' : 'Unblock Author'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AuthorsList
