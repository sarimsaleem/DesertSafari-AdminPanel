import { collection, getDocs, doc, deleteDoc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../../Firebase/firebaseConfig';

const blogCollectionRef = collection(db, 'blogs');

const uploadImage = async (file) => {
  if (!file) return null;

  const storageRef = ref(storage, `blogs/${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(snapshot.ref);

  return url;
};

const deleteImage = async (imageUrl) => {
  if (!imageUrl) return;

  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
    console.log('Image deleted successfully');
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};

export const Add = async (blog) => {
  try {
    // Upload images if provided
    const imageUrl = blog.image_url ? await uploadImage(blog.image_url) : null;
    const bannerImageUrl = blog.banner_image_url ? await uploadImage(blog.banner_image_url) : null;

    // Construct the blog data object
    const blogData = {
      ...blog,
      image_url: imageUrl,
      banner_image_url: bannerImageUrl,
      category: blog.category || null,
    };

    // Remove undefined fields
    Object.keys(blogData).forEach(key => {
      if (blogData[key] === undefined) {
        delete blogData[key];
      }
    });

    // Create a document reference for Firestore
    const blogDocRef = doc(blogCollectionRef, blog._id); // Ensure blog._id is defined

    // Add the blog to Firestore
    await setDoc(blogDocRef, blogData);

    console.log('Blog added successfully with UUID:', blog._id);
  } catch (error) {
    console.error('Error adding blog:', error);
  }
};

// Fetch all blogs from Firestore
export const fetchBlogs = async () => {
  try {
    const data = await getDocs(blogCollectionRef);
    const blogsList = data.docs.map((doc) => ({ ...doc.data(), _id: doc.id }));
    return blogsList;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
};

// Delete a blog by UUID
export const deleteBlog = async (blogId, imageUrl) => {
  try {
    const blogDocRef = doc(db, 'blogs', blogId);

    if (imageUrl) {
      await deleteImage(imageUrl);
    }
    await deleteDoc(blogDocRef);

    console.log('Blog deleted successfully');
  } catch (error) {
    console.error('Error deleting blog:', error);
  }
};

// Update an existing blog
export const update = async (blogId, updatedBlog) => {
  try {
    console.log('updatedBlog', updatedBlog)
    const blogDocRef = doc(db, 'blogs', blogId);
    console.log(blogDocRef, "Blog Document Reference");

    const blogSnapshot = await getDoc(blogDocRef);
    if (!blogSnapshot.exists()) {
      console.error(`No blog found with ID: ${blogId}. Snapshot exists: ${blogSnapshot.exists()}`);
      return;
    }

    const bannerImageUrl = updatedBlog?.banner_image_url || null;
    const newBannerImageUrl = updatedBlog?.banner_image_url || null;

    if (typeof updatedBlog?.banner_image_url !== 'string') {
      newBannerImageUrl = bannerImageUrl ? await uploadImage(bannerImageUrl) : null;
    }
    const blogData = {
      ...updatedBlog,
      ...(newBannerImageUrl ? { banner_image_url: newBannerImageUrl } : {}),
    };

    if (updatedBlog.category) {
      blogData.category = updatedBlog.category;
    }

    // Remove undefined fields
    Object.keys(blogData).forEach(key => {
      if (blogData[key] === undefined) {
        delete blogData[key];
      }
    });

    console.log(blogData, "blogData");

    await updateDoc(blogDocRef, blogData);
    console.log('Blog updated successfully');
  } catch (error) {
    console.error('Error updating blog:', error);
  }
};
