import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicChatLayout from "../../components/layout/PublicChatLayout";
import AssistantAvatar from "../../components/chat/AssistantAvatar";
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

  const avatarUrl =
    catPhotoUrl(profile?.avatar_url) || catPhotoUrl(photos[0]?.public_url);

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
          <div className="space-y-10">
            <section className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="h-32 w-32 overflow-hidden rounded-[32px] border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/30 transition duration-300 hover:scale-105">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={profile.display_name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <AssistantAvatar size="lg" />
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
                  className="mt-5 rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-200 transition hover:bg-zinc-800 hover:text-white"
                >
                  💬 Chat with Charmaine Cat
                </button>
              </div>
            </section>

            <section>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-zinc-100">
                    Stories
                  </h3>
                  <p className="mt-1 text-sm text-zinc-500">
                    Small moments behind Charmaine Cat’s assistant life.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {stories.length === 0 ? (
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-500">
                    No stories published yet.
                  </div>
                ) : (
                  stories.map((story, index) => {
                    const storyPhotoUrl = catPhotoUrl(story.photo_url);

                    return (
                      <article
                        key={story.id}
                        className="group overflow-hidden rounded-[28px] border border-zinc-800 bg-zinc-950 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-2xl hover:shadow-black/30"
                        style={{
                          animation: `fadeInUp 420ms ease ${index * 80}ms both`,
                        }}
                      >
                        {storyPhotoUrl ? (
                          <div className="relative h-64 overflow-hidden">
                            <img
                              src={storyPhotoUrl}
                              alt={
                                story.photo_alt_text ||
                                story.photo_caption ||
                                story.title
                              }
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            <div className="absolute bottom-4 left-4 right-4">
                              <div className="inline-flex rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-zinc-200 backdrop-blur">
                                Story #{index + 1}
                              </div>
                              <h4 className="mt-3 text-xl font-semibold text-white">
                                {story.title}
                              </h4>
                            </div>
                          </div>
                        ) : (
                          <div className="border-b border-zinc-800 p-5">
                            <div className="inline-flex rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
                              Story #{index + 1}
                            </div>
                            <h4 className="mt-4 text-xl font-semibold text-zinc-100">
                              {story.title}
                            </h4>
                          </div>
                        )}

                        <div className="p-5">
                          <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-400">
                            {story.body}
                          </p>

                          {story.photo_caption ? (
                            <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-xs text-zinc-500">
                              📷 {story.photo_caption}
                            </div>
                          ) : null}
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-zinc-100">
                Photo Gallery
              </h3>
              <p className="mt-1 text-sm text-zinc-500">
                A small gallery for Charmaine Cat’s public profile.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {photos.length === 0 ? (
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-500">
                    No photos published yet.
                  </div>
                ) : (
                  photos.map((photo, index) => (
                    <figure
                      key={photo.id}
                      className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 transition duration-300 hover:-translate-y-1 hover:border-zinc-700"
                      style={{
                        animation: `fadeInUp 420ms ease ${index * 70}ms both`,
                      }}
                    >
                      <img
                        src={catPhotoUrl(photo.public_url)}
                        alt={
                          photo.alt_text ||
                          photo.caption ||
                          "Charmaine Cat photo"
                        }
                        className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
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

            <style>
              {`
                @keyframes fadeInUp {
                  from {
                    opacity: 0;
                    transform: translateY(14px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
              `}
            </style>
          </div>
        ) : null}
      </div>
    </PublicChatLayout>
  );
}