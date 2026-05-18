import { useEffect, useState } from "react";
import {
  catPhotoUrl,
  createCatStory,
  deleteCatPhoto,
  deleteCatStory,
  getAdminCatProfile,
  updateAdminCatProfile,
  updateCatPhoto,
  updateCatStory,
  uploadCatPhoto,
  type CatPhoto,
  type CatProfile,
  type CatStory,
} from "../../lib/api";

type StoryDraft = {
  title: string;
  body: string;
  photo_id?: number | null;
  sort_order: number;
  is_published: boolean;
};

type PhotoDraft = {
  caption: string;
  alt_text: string;
  sort_order: number;
  is_published: boolean;
};

export default function CatProfileAdminPage() {
  const [profile, setProfile] = useState<CatProfile>({
    display_name: "Charmaine Cat",
    tagline: "Charmaine's personal assistant",
    bio: "",
    avatar_photo_id: null,
  });
  const [stories, setStories] = useState<CatStory[]>([]);
  const [photos, setPhotos] = useState<CatPhoto[]>([]);
  const [storyDraft, setStoryDraft] = useState<StoryDraft>({
  title: "",
  body: "",
  photo_id: null,
  sort_order: 0,
  is_published: true,
});
  const [photoDraft, setPhotoDraft] = useState<PhotoDraft>({
    caption: "",
    alt_text: "",
    sort_order: 0,
    is_published: true,
  });
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadProfile() {
    try {
      setLoading(true);
      setError("");
      const data = await getAdminCatProfile();
      setProfile(data.profile);
      setStories(data.stories ?? []);
      setPhotos(data.photos ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load Cat profile");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProfile();
  }, []);

  async function saveProfile() {
    try {
      setError("");
      const result = await updateAdminCatProfile({
        display_name: profile.display_name,
        tagline: profile.tagline,
        bio: profile.bio,
        avatar_photo_id: profile.avatar_photo_id ?? null,
      });
      setProfile(result.profile);
      setMessage("Profile saved.");
      await loadProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    }
  }

  async function addStory() {
    if (!storyDraft.title.trim() || !storyDraft.body.trim()) {
      setError("Story title and body are required.");
      return;
    }

    try {
      setError("");
      await createCatStory(storyDraft);
      setStoryDraft({
    title: "",
    body: "",
    photo_id: null,
    sort_order: 0,
    is_published: true,
    });
      setMessage("Story created.");
      await loadProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create story");
    }
  }

  async function saveStory(story: CatStory) {
    try {
      setError("");
      await updateCatStory(story.id, {
        title: story.title,
        body: story.body,
        photo_id: story.photo_id ?? null,
        sort_order: story.sort_order,
        is_published: story.is_published,
      });
      setMessage("Story updated.");
      await loadProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update story");
    }
  }

  async function removeStory(id: number) {
    if (!window.confirm("Delete this story?")) return;

    try {
      setError("");
      await deleteCatStory(id);
      setMessage("Story deleted.");
      await loadProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete story");
    }
  }

  async function uploadPhoto() {
    if (!selectedPhoto) {
      setError("Please choose a photo first.");
      return;
    }

    try {
      setError("");
      await uploadCatPhoto(selectedPhoto, photoDraft);
      setSelectedPhoto(null);
      setPhotoDraft({ caption: "", alt_text: "", sort_order: 0, is_published: true });
      setMessage("Photo uploaded.");
      await loadProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload photo");
    }
  }

  async function savePhoto(photo: CatPhoto) {
    try {
      setError("");
      await updateCatPhoto(photo.id, {
        caption: photo.caption,
        alt_text: photo.alt_text,
        sort_order: photo.sort_order,
        is_published: photo.is_published,
      });
      setMessage("Photo updated.");
      await loadProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update photo");
    }
  }

  async function removePhoto(id: number) {
    if (!window.confirm("Delete this photo?")) return;

    try {
      setError("");
      await deleteCatPhoto(id);
      setMessage("Photo deleted.");
      await loadProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete photo");
    }
  }

  function updateStoryLocal(id: number, patch: Partial<CatStory>) {
    setStories((prev) =>
      prev.map((story) => (story.id === id ? { ...story, ...patch } : story))
    );
  }

  function updatePhotoLocal(id: number, patch: Partial<CatPhoto>) {
    setPhotos((prev) =>
      prev.map((photo) => (photo.id === id ? { ...photo, ...patch } : photo))
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-100">Charmaine Cat Profile</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Manage Charmaine Cat’s public profile, stories, avatar, and photo gallery.
        </p>
      </div>

      {message ? (
        <div className="rounded-2xl border border-emerald-900 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-300">
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="text-sm text-zinc-500">Loading...</div>
      ) : (
        <>
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="text-sm font-semibold text-zinc-100">Profile Details</h2>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="text-sm text-zinc-400">
                Display name
                <input
                  value={profile.display_name}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, display_name: e.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none"
                />
              </label>

              <label className="text-sm text-zinc-400">
                Tagline
                <input
                  value={profile.tagline}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, tagline: e.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none"
                />
              </label>

              <label className="md:col-span-2 text-sm text-zinc-400">
                Bio
                <textarea
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  rows={4}
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none"
                />
              </label>

              <label className="text-sm text-zinc-400">
                Avatar photo
                <select
                  value={profile.avatar_photo_id ?? ""}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      avatar_photo_id: e.target.value ? Number(e.target.value) : null,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none"
                >
                  <option value="">No avatar</option>
                  {photos.map((photo) => (
                    <option key={photo.id} value={photo.id}>
                      {photo.caption || photo.original_filename}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <button
              onClick={() => void saveProfile()}
              className="mt-4 rounded-xl bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-white"
            >
              Save Profile
            </button>
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <h2 className="text-sm font-semibold text-zinc-100">Stories</h2>
        <p className="mt-1 text-sm text-zinc-500">
            Attach a gallery photo to each story so the public profile feels more like a real social profile.
            </p>

            <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_220px_120px]">
            <input
        placeholder="Story title"
        value={storyDraft.title}
        onChange={(e) =>
            setStoryDraft((prev) => ({ ...prev, title: e.target.value }))
        }
      className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none"
    />

    <input
      placeholder="Story body"
      value={storyDraft.body}
      onChange={(e) =>
        setStoryDraft((prev) => ({ ...prev, body: e.target.value }))
      }
      className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none"
    />

    <select
      value={storyDraft.photo_id ?? ""}
      onChange={(e) =>
        setStoryDraft((prev) => ({
          ...prev,
          photo_id: e.target.value ? Number(e.target.value) : null,
        }))
      }
      className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none"
    >
      <option value="">No story photo</option>
      {photos.map((photo) => (
        <option key={photo.id} value={photo.id}>
          {photo.caption || photo.original_filename}
        </option>
      ))}
    </select>

    <button
      onClick={() => void addStory()}
      className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-white"
    >
      Add Story
    </button>
  </div>

  <div className="mt-5 space-y-4">
    {stories.map((story) => {
      const selectedPhoto = photos.find((photo) => photo.id === story.photo_id);

        const selectedPhotoUrl = selectedPhoto
        ? catPhotoUrl(selectedPhoto.public_url)
        : catPhotoUrl(story.photo_url);

      return (
        <div
          key={story.id}
          className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4"
        >
          <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
            <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
          {selectedPhotoUrl ? (
            <img
              src={selectedPhotoUrl}
              alt={
                selectedPhoto?.alt_text ||
                selectedPhoto?.caption ||
                story.photo_alt_text ||
                story.title
              }
              className="h-44 w-full object-cover"
            />
          ) : (
            <div className="flex h-44 items-center justify-center text-sm text-zinc-500">
              No story photo
            </div>
          )}

          <div className="border-t border-zinc-800 px-3 py-2 text-xs text-zinc-500">
            Story image preview
          </div>
        </div>

            <div className="space-y-3">
              <div className="grid gap-3 md:grid-cols-[1fr_220px_120px_120px]">
                <input
                  value={story.title}
                  onChange={(e) =>
                    updateStoryLocal(story.id, { title: e.target.value })
                  }
                  className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none"
                />

                <select
                  value={story.photo_id ?? ""}
                  onChange={(e) =>
                    updateStoryLocal(story.id, {
                      photo_id: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none"
                >
                  <option value="">No story photo</option>
                  {photos.map((photo) => (
                    <option key={photo.id} value={photo.id}>
                      {photo.caption || photo.original_filename}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  value={story.sort_order}
                  onChange={(e) =>
                    updateStoryLocal(story.id, {
                      sort_order: Number(e.target.value),
                    })
                  }
                  className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none"
                />

                <label className="flex items-center gap-2 text-sm text-zinc-400">
                  <input
                    type="checkbox"
                    checked={story.is_published}
                    onChange={(e) =>
                      updateStoryLocal(story.id, {
                        is_published: e.target.checked,
                      })
                    }
                  />
                  Published
                </label>
              </div>

              <textarea
                value={story.body}
                onChange={(e) =>
                  updateStoryLocal(story.id, { body: e.target.value })
                }
                rows={4}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => void saveStory(story)}
                  className="rounded-xl border border-zinc-700 px-3 py-1.5 text-xs text-zinc-200 transition hover:bg-zinc-800"
                >
                  Save
                </button>

                <button
                  onClick={() => void removeStory(story.id)}
                  className="rounded-xl border border-red-900 px-3 py-1.5 text-xs text-red-300 transition hover:bg-red-950/40"
                >
                  Delete
                </button>
                </div>
                </div>
            </div>
            </div>
        );
        })}
    </div>
    </section> 

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="text-sm font-semibold text-zinc-100">Photo Gallery</h2>

            <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_1fr_120px]">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={(e) => setSelectedPhoto(e.target.files?.[0] ?? null)}
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-300"
              />
              <input
                placeholder="Caption"
                value={photoDraft.caption}
                onChange={(e) =>
                  setPhotoDraft((prev) => ({ ...prev, caption: e.target.value }))
                }
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none"
              />
              <input
                placeholder="Alt text"
                value={photoDraft.alt_text}
                onChange={(e) =>
                  setPhotoDraft((prev) => ({ ...prev, alt_text: e.target.value }))
                }
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none"
              />
              <button
                onClick={() => void uploadPhoto()}
                className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-white"
              >
                Upload
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950"
                >
                  <img
                    src={catPhotoUrl(photo.public_url)}
                    alt={photo.alt_text || photo.caption || photo.original_filename}
                    className="h-48 w-full object-cover"
                  />

                  <div className="space-y-3 p-4">
                    <input
                      value={photo.caption}
                      onChange={(e) =>
                        updatePhotoLocal(photo.id, { caption: e.target.value })
                      }
                      placeholder="Caption"
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none"
                    />
                    <input
                      value={photo.alt_text}
                      onChange={(e) =>
                        updatePhotoLocal(photo.id, { alt_text: e.target.value })
                      }
                      placeholder="Alt text"
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none"
                    />
                    <input
                      type="number"
                      value={photo.sort_order}
                      onChange={(e) =>
                        updatePhotoLocal(photo.id, {
                          sort_order: Number(e.target.value),
                        })
                      }
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none"
                    />
                    <label className="flex items-center gap-2 text-sm text-zinc-400">
                      <input
                        type="checkbox"
                        checked={photo.is_published}
                        onChange={(e) =>
                          updatePhotoLocal(photo.id, {
                            is_published: e.target.checked,
                          })
                        }
                      />
                      Published
                    </label>

                    <div className="flex gap-2">
                      <button
                        onClick={() => void savePhoto(photo)}
                        className="rounded-xl border border-zinc-700 px-3 py-1.5 text-xs text-zinc-200 transition hover:bg-zinc-800"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => void removePhoto(photo.id)}
                        className="rounded-xl border border-red-900 px-3 py-1.5 text-xs text-red-300 transition hover:bg-red-950/40"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}