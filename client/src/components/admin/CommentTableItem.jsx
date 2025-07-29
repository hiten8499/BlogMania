import React from 'react'
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const CommentTableItem = ({comments,fetchComments}) => {

    const {blog ,createdAt,_id}=comments;
    const BlogDate=new Date(createdAt);

    const {axios}=useAppContext()

    const approveComment=async () => {
      try {
        const {data}=await axios.post('/api/admin/approve-comment',{id:_id})
        if (data.success) {
          toast.success(data.message)
          fetchComments()
        }
      } catch (error) {
        toast.error(error.message)
      }
    }

    const deletComment=async () => {
      try {
        const confirm=window.confirm("Are You Sure.??");
        if (!confirm) return;
          
         const {data}=await axios.post('/api/admin/delete-comment',{id:_id})
        if (data.success) {
          toast.success(data.message)
          fetchComments()
        }
      } catch (error) {
        toast.error(error.message)
      }
    }



  return (
    <tr className='order-y border-gray-300'>
      <td className='px-6 py-4'> 
        <b className='font-medium text-gray-600'>Blog</b> :{blog.title}
        <br /> <br />
        <b className='font-medium text-gray-600'>Name</b> : {comments.name}
         <br />
         <b className='font-medium text-gray-600'>Comment</b> : {comments.content}
         </td>
         <td className='px-6 py-4 max-sm:hidden'>
            {BlogDate.toDateString()}
         </td>
          <td className='px-6 py-4'>
             <div className='inline-flex items-center gap-4'>
                {!comments.isApproved ? 
                < img src={assets.tick_icon} onClick={approveComment} className='w-5 hover:scale-110
                transition-all cursor-pointer'/> : <p className='text-xs border border-green-600
                bg-green-100 text-green-600 rounded-full px-3 py-1'>Approved</p> }
                <img src={assets.bin_icon} onClick={deletComment} className='w-5 hover:scale-110 
                transition-all cursor-pointer' alt="" />
             </div>
          </td>
    </tr>
  )
}

export default CommentTableItem
