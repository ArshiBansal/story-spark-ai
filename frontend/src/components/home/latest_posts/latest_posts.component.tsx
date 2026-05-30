import { useGetLatestListsQuery } from "../../../redux/apis/post.api";
import { Post } from "../../../models/post";
import LoadingAnimation from "../../loading/loading.component";
import SSProfile from "../../ui-component/ss-profile/ss-profile";
import { formatDateShort } from "../../../utils/time-formate";
import { useNavigate } from "react-router-dom";
import BookmarkButton from "../../BookmarkButton";

const LatestPostsComponent = () => {
  const { data, isLoading } = useGetLatestListsQuery(undefined);
  const navigate = useNavigate();

  const calculateReadingTime = (content: string): number => {
    if (!content) return 1;
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="text-slate-900 dark:text-slate-100">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        Latest Posts
      </h2>
      <div className="space-y-6">
        {(data?.posts?.length ?? 0) > 0 ? (
          data?.posts?.map((post: Post) => (
            <div
              key={post._id}
              onClick={() => navigate(`/post/${post._id}`)}
              className="motion-card-subtle story-panel group relative cursor-pointer rounded-2xl p-6 border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/40 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-indigo-500/30 shadow-md shadow-slate-100 dark:shadow-none flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <SSProfile name={post.author?.name || "Unknown User"} size="h-10 w-10" />
                  <div className="ml-3">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {post.author?.name || "Unknown User"}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {formatDateShort(post.createdAt)}
                      </p>
                      <span className="text-slate-400 dark:text-slate-600 text-xs">•</span>
                      <p className="text-xs text-indigo-500 dark:text-indigo-300 font-medium flex items-center gap-1">
                        ⏱️ {calculateReadingTime(post.content)} min read
                      </p>
                    </div>
                  </div>
                </div>

                <div onClick={(e) => e.stopPropagation()} className="relative z-10">
                  <BookmarkButton
                    storyId={post._id}
                    bookmarks={post.bookmarks}
                    className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  />
                </div>
              </div>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                {post.title}
              </h3>
              
              <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2 leading-relaxed">
                {post.content}
              </p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 gap-4">
                  <span className="flex items-center gap-1">
                    <i className="far fa-heart"></i> {post.likesCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <i className="far fa-comment"></i> {post.commentsCount}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.topic?.map((topic) => (
                    <span
                      key={topic._id}
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${topic.color}`}
                    >
                      {topic.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/20 px-4 py-5 text-slate-500 dark:text-slate-400">
            Posts are not available.
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestPostsComponent;