import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BlogPostForm from "../../BlogPostForm";
import { updateBlogPost } from "@/app/actions/blog";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });

  if (!post) notFound();

  const boundAction = updateBlogPost.bind(null, id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Blog Post</h1>
        <p className="text-gray-500 mt-1">{post.title}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <BlogPostForm action={boundAction} submitLabel="Save Changes" initial={post} />
      </div>
    </div>
  );
}
