import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicChatLayout from "../../components/layout/PublicChatLayout";
import {
  catPhotoUrl,
  getPublicCatProfile,
  type CatPhoto,
  type CatProfile,
  type CatStory,
} from "../../lib/api";

export default function CatProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<CatProfile | null>(null);
  const [stories, setStories] = useState<CatStory[]>([]);
  const [photos, setPhotos] = useState<CatPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await getPublicCatProfile();
        setProfile(data.profile);
        setStories(data.stories ?? []);
        setPhotos(data.photos ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  const avatarUrl = catPhotoUrl(profile?.avatar_url) || catPhotoUrl(photos[0]?.public_url);

  return (
    <PublicChatLayout
      title="Charmaine Cat Profile"
      subtitle="Meet Charmaine’s AI personal assistant, browse her stories, and view her photo gallery."
    >
      <div className="glass-panel soft-border rounded-[32px] p-6 md:p-8">
        {loading ? (
          <div className="text-sm text-zinc-400">Loading Charmaine Cat...</div>
        ) : error ? (
          <div className="rounded-2xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        ) : profile ? (
          <div className="space-y-8">
            <section className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="h-32 w-32 overflow-hidden rounded-[32px] border border-zinc-800 bg-zinc-900">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={profile.display_name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-5xl">
                    🐱
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="hero-chip">Personal assistant persona</div>
                <h2 className="mt-4 text-3xl font-semibold text-zinc-100">
                  {profile.display_name}
                </h2>
                <p className="mt-2 text-lg text-zinc-300">{profile.tagline}</p>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400">
                  {profile.bio}
                </p>

                <button
                  onClick={() => navigate("/")}
                  className="mt-5 rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-200 transition hover:bg-zinc-800"
                >
                  💬 Chat with Charmaine Cat
                </button>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-zinc-100">Stories</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {stories.length === 0 ? (
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-500">
                    No stories published yet.
                  </div>
                ) : (
                  stories.map((story) => (
                    <article
                      key={story.id}
                      className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
                    >
                      <div className="text-sm font-semibold text-zinc-100">
                        {story.title}
                      </div>
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-400">
                        {story.body}
                      </p>
                    </article>
                  ))
                )}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-zinc-100">Photo Gallery</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {photos.length === 0 ? (
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-500">
                    No photos published yet.
                  </div>
                ) : (
                  photos.map((photo) => (
                    <figure
                      key={photo.id}
                      className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950"
                    >
                      <img
                        src={catPhotoUrl(photo.public_url)}
                        alt={photo.alt_text || photo.caption || "Charmaine Cat photo"}
                        className="h-56 w-full object-cover"
                      />
                      {photo.caption ? (
                        <figcaption className="px-4 py-3 text-sm text-zinc-400">
                          {photo.caption}
                        </figcaption>
                      ) : null}
                    </figure>
                  ))
                )}
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </PublicChatLayout>
  );
}