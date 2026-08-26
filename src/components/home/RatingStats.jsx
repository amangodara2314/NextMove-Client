import RatingStatsSkeleton from "./RatingStatsSkeleton";

export default function RatingStats({ ratings, ratingsError, loadingRatings }) {
  return (
    <section>
      <h2 className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Your standing
      </h2>
      {loadingRatings ? (
        <RatingStatsSkeleton count={4} />
      ) : ratingsError ? (
        <div className="text-red-500">
          <p>Error loading ratings statistics: {ratingsError}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 divide-x divide-y divide-border rounded-xl border border-border bg-card sm:grid-cols-4 sm:divide-y-0">
          {ratings.map((rating) => (
            <div key={rating.type} className="px-5 py-6">
              <p
                className="text-3xl text-card-foreground"
                style={{ fontFamily: "'Newsreader', serif" }}
              >
                {rating.rating}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {rating.type}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
