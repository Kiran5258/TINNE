import React, { useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { IconUpload, IconClose } from '../components/Icons';
import toast from 'react-hot-toast';
import { useBlogStore } from '@/services/useBlogStore';

export const AddPost: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [authorAvatar, setAuthorAvatar] = useState<string | null>(null);
  const addPost = useBlogStore((state) => state.addPost);

  const [formData, setFormData] = useState({
    title: '',
    authorName: '',
    category: '',
    excerpt: '',
    content: ''
  });

  /* ---------------- IMAGE UPLOAD ---------------- */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  /* ---------------- AUTHOR AVATAR ---------------- */
  const handleAuthorAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAuthorAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imagePreview) {
      toast.error("Image is required");
      return;
    }

    if (!formData.authorName) {
      toast.error("Author name is required");
      return;
    }

    setLoading(true);

    const payload = {
      title: formData.title,
      category: formData.category,
      excerpt: formData.excerpt,
      content: formData.content,
      author: {
        name: formData.authorName,
        avatar: authorAvatar,
      },
      image: imagePreview,
      slug: formData.title.toLowerCase().replace(/\s+/g, "-"),
    };

    try {
      await addPost(payload); 
      toast.success("Post published successfully");

      setFormData({
        title: "",
        authorName: "",
        category: "",
        excerpt: "",
        content: "",
      });
      setImagePreview(null);
      setAuthorAvatar(null);

    } catch (err: any) {
      toast.error(err.message || "Failed to publish post");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold font-display mb-8">
        Create New Journal Entry
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Input
              label="Article Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. The Revival of Red Millet"
              required
            />

            <Input
              label="Author Name"
              name="authorName"
              value={formData.authorName}
              onChange={handleChange}
              placeholder="Enter author name"
              required
            />

            <div className="w-full">
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50"
                required
              >
                <option value="">Select Category</option>
                <option value="Field Notes from Indian Farms">Field Notes from Indian Farms</option>
                <option value="Rituals & Recipes">Rituals & Recipes</option>
                <option value="People Who Shape Our Brand">People Who Shape Our Brand</option>
                <option value="Backed by Science">Backed by Science</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Excerpt
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 h-32 resize-none"
                placeholder="Short summary for preview cards..."
                required
              />
            </div>
          </div>

          {/* HERO IMAGE */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Hero Image
            </label>
            <div className="border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center relative h-64 flex items-center justify-center">
              {imagePreview ? (
                <div className="absolute inset-0 p-2">
                  <img src={imagePreview} className="h-full w-full object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute top-4 right-4 bg-white p-2 rounded-full shadow"
                  >
                    <IconClose className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <IconUpload className="w-10 h-10 text-neutral-400 mb-3" />
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* AUTHOR AVATAR */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Author Avatar
          </label>
          <div className="flex items-center gap-4">
            {authorAvatar && (
              <img src={authorAvatar} className="w-14 h-14 rounded-full object-cover border" />
            )}
            <div className="border-2 border-dashed p-4 rounded-xl relative">
              <IconUpload className="w-5 h-5 text-neutral-400" />
              <input
                type="file"
                onChange={handleAuthorAvatar}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Article Content
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full p-6 h-96 border rounded-xl resize-none font-mono text-sm"
            placeholder="Write your story here..."
            required
          />
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button type="submit" size="lg" isLoading={loading}>
            Publish Article
          </Button>
        </div>
      </form>
    </div>
  );
};
