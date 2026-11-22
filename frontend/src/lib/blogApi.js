import { BLOG_HERO_SLIDES, BLOG_POSTS, BLOG_CATEGORIES } from '../data/blogsData';
import { fetchWithAuth } from './authApi';

const API_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CACHE_KEY_BLOGS = 'tts_cached_blogs_v1';

export { BLOG_CATEGORIES };

export const DEFAULT_BLOG_SETTINGS = {
  id: 'global',
  hero_badge: 'Himalayan Trail Journals & Field Guides',
  hero_title_line1: 'STORIES FROM THE HIGH RIDGES,',
  hero_title_cursive: 'wisdom for every climb.',
  hero_subtitle:
    'Packing checklists, winter snowcraft, acclimatization science, and raw camp stories penned by TrekToShikhar’s Shimla & Dehradun expedition leaders.',
  hero_slides: BLOG_HERO_SLIDES,
  cta_badge: 'Once a Shikharite, Always a Shikharite',
  cta_heading: 'Ready To Turn Reading Into Your Next Summit?',
  cta_subtitle:
    'Join our small-batch Himalayan departures from Shimla & Dehradun — guided by the very leaders who wrote these field journals.'
};

export function getCachedBlogs() {
  try {
    const raw = localStorage.getItem(CACHE_KEY_BLOGS);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.settings && Array.isArray(parsed.posts)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function setCachedBlogs(payload) {
  try {
    if (payload && payload.settings && Array.isArray(payload.posts)) {
      localStorage.setItem(CACHE_KEY_BLOGS, JSON.stringify(payload));
    }
  } catch {
    // Ignore storage quota errors
  }
}

function broadcastBlogUpdate(payload) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('tts-blogs-updated', { detail: payload }));
  }
}

// ----------------------------------------------------------------------
// 1. GET PUBLIC BLOG DATA (SWR Cache)
// ----------------------------------------------------------------------
export async function getBlogData(options = {}) {
  try {
    const res = await fetch(`${API_URL}/blogs`);
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    const json = await res.json();

    const settings = json.settings || DEFAULT_BLOG_SETTINGS;
    const posts = Array.isArray(json.posts) && json.posts.length > 0 ? json.posts : BLOG_POSTS;

    if (!options.admin) {
      setCachedBlogs({ settings, posts });
    }

    return {
      settings,
      posts,
      source: json.source || 'live'
    };
  } catch (err) {
    console.warn('⚠️ Fetching Blogs via API failed, using cached/default:', err.message);
    const cached = getCachedBlogs();
    return {
      settings: cached?.settings || DEFAULT_BLOG_SETTINGS,
      posts: cached?.posts || BLOG_POSTS,
      source: 'cache'
    };
  }
}

// ----------------------------------------------------------------------
// 2. GET ADMIN ALL BLOGS (INCLUDING DRAFTS)
// ----------------------------------------------------------------------
export async function getAdminBlogData() {
  try {
    const res = await fetchWithAuth(`${API_URL}/blogs/admin/all`);
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    const json = await res.json();
    return {
      settings: json.settings || DEFAULT_BLOG_SETTINGS,
      posts: Array.isArray(json.posts) ? json.posts : BLOG_POSTS,
      source: 'live'
    };
  } catch (err) {
    console.warn('⚠️ Fetching Admin Blogs failed:', err.message);
    const cached = getCachedBlogs();
    return {
      settings: cached?.settings || DEFAULT_BLOG_SETTINGS,
      posts: cached?.posts || BLOG_POSTS,
      source: 'fallback'
    };
  }
}

// ----------------------------------------------------------------------
// 3. GET SINGLE POST BY SLUG
// ----------------------------------------------------------------------
export async function getBlogPostBySlug(slug) {
  try {
    const res = await fetch(`${API_URL}/blogs/${slug}`);
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    const json = await res.json();
    return json.post || null;
  } catch (err) {
    console.warn(`⚠️ Fetching single blog (${slug}) failed:`, err.message);
    const cached = getCachedBlogs();
    const list = cached?.posts || BLOG_POSTS;
    return list.find((p) => p.slug === slug) || null;
  }
}

// ----------------------------------------------------------------------
// 4. CREATE BLOG POST
// ----------------------------------------------------------------------
export async function createBlogPost(postData) {
  const res = await fetchWithAuth(`${API_URL}/blogs`, {
    method: 'POST',
    body: JSON.stringify(postData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to create trail journal');
  }
  const json = await res.json();

  // Optimistic update of local cache
  const cached = getCachedBlogs() || { settings: DEFAULT_BLOG_SETTINGS, posts: BLOG_POSTS };
  const updatedPosts = [json.post, ...cached.posts];
  setCachedBlogs({ settings: cached.settings, posts: updatedPosts });
  broadcastBlogUpdate({ settings: cached.settings, posts: updatedPosts });

  return json;
}

// ----------------------------------------------------------------------
// 5. UPDATE BLOG POST
// ----------------------------------------------------------------------
export async function updateBlogPost(id, postData) {
  const res = await fetchWithAuth(`${API_URL}/blogs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(postData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to update trail journal');
  }
  const json = await res.json();

  const cached = getCachedBlogs() || { settings: DEFAULT_BLOG_SETTINGS, posts: BLOG_POSTS };
  const updatedPosts = cached.posts.map((p) => (p.id === id ? json.post : p));
  setCachedBlogs({ settings: cached.settings, posts: updatedPosts });
  broadcastBlogUpdate({ settings: cached.settings, posts: updatedPosts });

  return json;
}

// ----------------------------------------------------------------------
// 6. DELETE BLOG POST
// ----------------------------------------------------------------------
export async function deleteBlogPost(id) {
  const res = await fetchWithAuth(`${API_URL}/blogs/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to delete trail journal');
  }
  const json = await res.json();

  const cached = getCachedBlogs() || { settings: DEFAULT_BLOG_SETTINGS, posts: BLOG_POSTS };
  const updatedPosts = cached.posts.filter((p) => p.id !== id);
  setCachedBlogs({ settings: cached.settings, posts: updatedPosts });
  broadcastBlogUpdate({ settings: cached.settings, posts: updatedPosts });

  return json;
}

// ----------------------------------------------------------------------
// 7. TOGGLE BLOG STATUS (Published vs Draft)
// ----------------------------------------------------------------------
export async function toggleBlogStatus(id, is_published) {
  const res = await fetchWithAuth(`${API_URL}/blogs/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ is_published })
  });
  if (!res.ok) throw new Error('Failed to toggle publication status');
  const json = await res.json();

  const cached = getCachedBlogs();
  if (cached) {
    const updatedPosts = cached.posts.map((p) =>
      p.id === id ? { ...p, isPublished: is_published, is_published } : p
    );
    setCachedBlogs({ settings: cached.settings, posts: updatedPosts });
    broadcastBlogUpdate({ settings: cached.settings, posts: updatedPosts });
  }
  return json;
}

// ----------------------------------------------------------------------
// 8. TOGGLE FEATURED
// ----------------------------------------------------------------------
export async function toggleBlogFeatured(id, { featured, featured_on_home }) {
  const res = await fetchWithAuth(`${API_URL}/blogs/${id}/featured`, {
    method: 'PATCH',
    body: JSON.stringify({ featured, featured_on_home })
  });
  if (!res.ok) throw new Error('Failed to toggle featured status');
  const json = await res.json();

  const cached = getCachedBlogs();
  if (cached) {
    const updatedPosts = cached.posts.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          ...(featured !== undefined && { featured }),
          ...(featured_on_home !== undefined && {
            featuredOnHome: featured_on_home,
            featured_on_home
          })
        };
      }
      if (featured) {
        return { ...p, featured: false };
      }
      return p;
    });
    setCachedBlogs({ settings: cached.settings, posts: updatedPosts });
    broadcastBlogUpdate({ settings: cached.settings, posts: updatedPosts });
  }
  return json;
}

// ----------------------------------------------------------------------
// 9. UPDATE BLOG HERO SETTINGS
// ----------------------------------------------------------------------
export async function updateBlogSettings(settingsPayload) {
  const res = await fetchWithAuth(`${API_URL}/blogs/settings`, {
    method: 'PUT',
    body: JSON.stringify(settingsPayload)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to update hero settings');
  }
  const json = await res.json();

  const cached = getCachedBlogs() || { settings: DEFAULT_BLOG_SETTINGS, posts: BLOG_POSTS };
  setCachedBlogs({ settings: json.settings, posts: cached.posts });
  broadcastBlogUpdate({ settings: json.settings, posts: cached.posts });

  return json;
}

// ----------------------------------------------------------------------
// 10. RESET BLOGS
// ----------------------------------------------------------------------
export async function resetBlogsToDefault() {
  const res = await fetchWithAuth(`${API_URL}/blogs/reset`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to reset blogs');
  const json = await res.json();

  localStorage.removeItem(CACHE_KEY_BLOGS);
  broadcastBlogUpdate({ settings: DEFAULT_BLOG_SETTINGS, posts: BLOG_POSTS });

  return json;
}
