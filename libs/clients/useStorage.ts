import { Category } from "@/api/v1/categories";
export const CATEGORIES_KEY = "CATEGORIES";

export interface AddVideoResult {
  ok: boolean;
  data?: string;
  error?: string;
}

const useStorage = () => {
  /**
   * Getting only category names.
   */
  const getCategoryNames = () =>
    getCategories().map((category) => category.name);

  /**
   * Getting categories as string.
   */
  const getCategoriesAsString = () => localStorage.getItem(CATEGORIES_KEY);

  /**
   * Getting parsed categories.
   */
  const getCategories = (): Category[] => {
    const categories = getCategoriesAsString();
    return categories ? JSON.parse(categories) : [];
  };

  /**
   * Getting category by name.
   * @param {string} name
   */
  const getCategoryByName = (name: string): Category | undefined => {
    return getCategories().find((c) => c.name === name);
  };

  /**
   * Delete specific category.
   */
  const deleteCategory = (category: string): boolean => {
    try {
      const categories = getCategories();
      const filteredCategories = categories.filter((c) => c.name !== category);
      setCategories(filteredCategories);
      return true;
    } catch (e) {
      console.error("[deleteCategory]", e);
      return false;
    }
  };

  /**
   * Setting categories (override).
   */
  const setCategories = (categories: Category[]) => {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  };

  const addCategory = (name: string) => {
    const categories = getCategories();
    const isExist = categories.some((c) => c.name === name);
    if (isExist) return false;
    categories.push({ name: name.toLowerCase(), videos: [] });
    setCategories(categories);
    return true;
  };

  const extractVideoId = (videoUrl: string) => {
    // First process.
    let key = "watch?v=";
    let startIndex = videoUrl.indexOf(key);
    let endIndex = videoUrl.indexOf("&ab_channel");
    let isValid = startIndex !== -1 || endIndex !== -1;
    if (isValid) return videoUrl.slice(startIndex + key.length, endIndex);

    // Second process.
    key = "https://youtu.be/";
    isValid = videoUrl.includes(key);
    if (isValid) return videoUrl.slice(key.length);
    return null;
  };

  const addVideo = (categoryName: string, videoUrl: string): AddVideoResult => {
    const videoId = extractVideoId(videoUrl);
    if (!videoId)
      return {
        ok: false,
        error: "해당 유튜브 영상 주소는 유효하지 않습니다.",
      };

    const categories = getCategories();

    // Check exists.
    const foundCategory = categories.find((c) => c.name === categoryName);
    const isExists = foundCategory?.videos.some((v) => v === videoId);
    if (isExists)
      return {
        ok: false,
        error: "해당 유튜브 영상은 이미 등록되어있습니다.",
      };

    const modifiedCategories = categories.map((c) => {
      if (c.name.toLowerCase() === categoryName.toLowerCase()) {
        // Remove duplicates.
        c.videos.push(videoId);
        const duplicatesRemovedCategories = Array.from(new Set(c.videos));
        c.videos = [...duplicatesRemovedCategories];
      }
      return c;
    });

    setCategories(modifiedCategories);
    return {
      ok: true,
      data: videoId,
    };
  };

  /**
   * Getting videos by category name.
   * @param {string} name
   */
  const getVideosByCategoryName = (name: string) => {
    const category = getCategoryByName(name);
    return category?.videos || [];
  };

  /**
   * Delete video by id.
   * @param {string} id
   */
  const deleteVideoById = (categoryName: string, id: string) => {
    if (confirm(`정말로 '${id}' 영상을 삭제하시겠습니까?`)) {
      const category = getCategoryByName(categoryName);
      if (!category) return false;
      const filteredCategoryVideos = category.videos.filter(
        (videoId) => videoId !== id
      );

      // Update category.
      const updatedCategories = getCategories().map((category) => {
        if (category.name === categoryName) {
          category.videos = [...filteredCategoryVideos];
        }
        return category;
      });

      setCategories(updatedCategories);

      return true;
    }
    return false;
  };

  return {
    getCategoriesAsString,
    getCategories,
    getCategoryNames,
    getCategoryByName,
    deleteCategory,
    setCategories,
    addCategory,
    addVideo,
    getVideosByCategoryName,
    deleteVideoById,
  };
};

export default useStorage;
