import BlogPostForm from "../BlogPostForm";
import { createBlogPost } from "@/app/actions/blog";

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add Blog Post</h1>
        <p className="text-gray-500 mt-1">Write a new article for the public site.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <BlogPostForm action={createBlogPost} submitLabel="Create Post" />
      </div>
    </div>
  );
}
