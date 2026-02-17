export default function SitemapLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="text-center mb-12">
          <div className="h-12 bg-gray-200 rounded-lg w-96 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-full max-w-3xl mx-auto animate-pulse"></div>
        </div>

        {/* Sitemap Content Skeleton */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6">
              <div className="h-8 bg-gray-200 rounded-lg w-32 mb-4 animate-pulse"></div>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, linkIndex) => (
                  <div key={linkIndex} className="p-3">
                    <div className="h-5 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* SEO Information Skeleton */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <div className="h-8 bg-gray-200 rounded-lg w-64 mb-6 animate-pulse"></div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="h-6 bg-gray-200 rounded-lg w-40 mb-3 animate-pulse"></div>
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-4 bg-gray-200 rounded w-full animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
            <div>
              <div className="h-6 bg-gray-200 rounded-lg w-32 mb-3 animate-pulse"></div>
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-4 bg-gray-200 rounded w-full animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
